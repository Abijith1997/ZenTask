import { supabase } from "@/supabaseClient";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { User, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/Pages/Home/MainApp/CreateNew/AddNew/Task/taskSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { userData } from "@/Interface/Types";
import { insertUserInDB } from "@/Slices/UserSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/Store";
import { useNavigate } from "react-router-dom";

export const GetDetails = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(data?.user);
      return data.user;
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      setPreviewURL(user.user_metadata.avatar_url);
    }
  }, [user]);

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file); // ✅ store the actual File
      setPreviewURL(URL.createObjectURL(file)); // ✅ store the preview URL
    }
  };

  const removeImage = () => {
    setProfilePic(null);
  };

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: user?.id || "",
      display_name: user?.user_metadata.full_name || "",
      email: user?.email || "",
      created_at: user?.created_at || new Date().toISOString(),
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      console.log(user?.id);
      form.setValue("id", user?.id);
      form.setValue("email", user?.email!);
      form.setValue("created_at", user?.created_at);
    }
  }, [user, form]);

  useEffect(() => {
    if (user?.user_metadata.full_name) {
      form.setValue("display_name", user.user_metadata.full_name);
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    console.log(data);
    console.log(profilePic, "Profile Pic");
    if (profilePic) {
      const fileName = `${Date.now()}-${profilePic.name}`;
      const { data, error } = await supabase.storage
        .from("profilepicture")
        .upload(fileName, profilePic);
      console.log(data, error);
      if (error) {
        console.error("Error uploading image:", error.message);
      } else {
        const { data: url } = supabase.storage
          .from("profilepicture")
          .getPublicUrl(fileName);

        setImageURL(url.publicUrl);
      }
    }
    if (user) {
      try {
        const newUser: userData = {
          id: user.id as `${string}-${string}-${string}-${string}-${string}`,
          email: user.email,
          Phone: data.phone || "",
          created_at: new Date().toISOString(),
          F_Name: data.first_name,
          L_Name: data.last_name,
          Display_name: data.display_name,
          profile_pic: imageURL || null,
        };
        const result = await dispatch(insertUserInDB(newUser)).unwrap();
        console.log(result);
        navigate("/");
      } catch (err: unknown) {
        console.error("Failed to insert user:", err);
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Please fill in your information
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {previewURL ? (
                <div className="relative">
                  <img
                    src={previewURL}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div
                    onClick={removeImage}
                    className="absolute flex items-center justify-center top-2 right-0 bg-white/50 text-black !rounded-full hover:bg-gray-200 hover:text-red-400 transition-colors !w-5 !h-5 text-xs"
                  >
                    <span className=" text-xs font-medium">X</span>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                  <User size={32} className="text-gray-400" />
                </div>
              )}
            </div>

            <label className="cursor-pointer">
              <Input
                type="file"
                onChange={handleProfilePicUpload}
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Upload size={16} />
                <span className="text-sm font-medium">Upload Profile Pic</span>
              </Button>
            </label>
          </div>

          <FormProvider {...form}>
            <form className="submit-form p-5 h-full sm:max-h-[400px] w-full gap-2 flex flex-col ">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter your first name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter your last name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Display Name *</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="How others will see you"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </FormProvider>

          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
          >
            Save Details
          </Button>
        </div>
      </div>
    </div>
  );
};
