import { Loader2 } from "lucide-react";
import { useAuth } from "../../stores/AuthStore";
import toast from "react-hot-toast";
import { useGetUserDetails } from "@/lib/queries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateOrgProfile } from "@/lib/mutations";
import { profileSchema } from "@/lib/schemas";

const Profile = () => {
	const { user } = useAuth();
	const { data, isLoading } = useGetUserDetails(user?._id);
	const { mutateAsync, isPending: createProfileLoading } =
		useCreateOrgProfile();

	const form = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			business_name: data?.business_name || "",
			contact_email: data?.contact_email || "",
			phone: data?.phone || "",
		},
	});

	const onSubmit = async (values: z.infer<typeof profileSchema>) => {
		try {
			const { business_name, contact_email, phone } = values;
			if (user?._id) {
				await mutateAsync({
					business_name,
					contact_email,
					phone,
					userId: user?._id,
				});
				toast.success("Profile updated successfully");
			} else {
				toast.error("User ID is undefined");
				return;
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error("Failed to update profile");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
			</div>

			<div className="bg-white rounded-lg shadow-sm border border-gray-100">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="p-6 space-y-6"
					>
						<FormField
							control={form.control}
							name="business_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Business Name</FormLabel>
									<FormControl>
										<Input placeholder="Business Name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="contact_email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contact Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Contact Email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input type="tel" placeholder="Phone Number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end">
							<Button type="submit" disabled={createProfileLoading}>
								{createProfileLoading ? (
									<>
										<Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Profile;
