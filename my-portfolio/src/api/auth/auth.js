import axios from 'axios'
export const loginUser = async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 1500))
    const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
    )
    return data
}

export const getMeRequest = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        withCredentials: true
    }
    )
    return data.user
}