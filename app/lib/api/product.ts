import axios from "axios";

export const registerProduct = async (
  formData: FormData,
  token: string
): Promise<any> => {
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/product`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`, // 여기서 Bearer 붙이기
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const fetchProductDetail = async (productId: number, token: string) => {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/product/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};
