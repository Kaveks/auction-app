import { profileType } from "@/types/collections";

export const updateProfileField = async (
  profile: profileType,
  field: string,
  value: string
) => {
  try {
    const response = await fetch(`/api/profile/${profile.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: value }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.log(data.message);
      return;
    }

    const { data } = await response.json();
    console.log("profile", data);

  } catch (error) {
    console.log(`Profile ${field} update`, error);
  }
};