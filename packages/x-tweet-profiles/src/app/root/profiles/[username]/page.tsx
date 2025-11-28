import { supabase } from "@/lib/supabase";

export default async function ProfilePage({ params }: any) {
  const { username } = params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile)
    return <div className="p-6 text-red-500">User not found.</div>;

  return (
    <div className="p-6">
      <img
        src={profile.avatar_url}
        alt="avatar"
        className="w-20 h-20 rounded-full mb-3"
      />
      <h1 className="text-xl font-bold">@{profile.username}</h1>
      <p className="text-gray-700 mt-2">{profile.bio}</p>

      <div className="mt-4 text-sm text-gray-500">
        Followers: {profile.followers_count}
        <br />
        Following: {profile.following_count}
      </div>
    </div>
  );
}
