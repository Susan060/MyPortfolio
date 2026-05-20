import axios from 'axios'

export const submitContact = async ({ name, email, phone, topic, message }) => {
  await new Promise((r) => setTimeout(r, 1500))
  const { data } = await axios.post(`/api/contact`, { name, email, phone, topic, message })
  return data
}

export const fetchContact = async (id) => {
  const { data } = await axios.get(`/api/contact/${id}`, { withCredentials: true })
  return data.contact
}

export const fetchAll = async () => {
  const { data } = await axios.get(`/api/contact`, { withCredentials: true })
  return data.contacts || []
}

export const sendReply = async ({ id, reply, imageFile }) => {
  const fd = new FormData()
  fd.append("reply", reply)
  if (imageFile) fd.append("replyImage", imageFile)
  const { data } = await axios.put(`/api/contact/${id}/reply`, fd, { withCredentials: true })
  return data
}