import axios from 'axios'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

export const api = axios.create({
    baseURL: "http://localhost:8000/api"
})

export const getAllProperties = async () => {
    try {

        const response = await api.get("/residency/allresd", {
            timeout: 10 * 1000,
        })

        if (response.status === 400 || response.status === 500) {
            throw response.data
        }
        return response.data
    } catch (error) {
        toast.error("Something Went Wrong", { position: "bottom-right" })
        throw error;
    }
}

export const getAddedProperties = async (email) => {
    try {
        const response = await api.get(`/residency/addedresd/${email}`, {
            timeout: 10 * 1000,
        })
        if (response.status === 400 || response.status === 500) {
            throw response.data
        }
        return response.data
    } catch (error) {
        toast.error("Something Went Wrong while fetching Added Properties", { position: "bottom-right" })
    }
}

export const getProperty = async (id) => {
    try {

        const response = await api.get(`/residency/${id}`, {
            timeout: 10 * 1000,
        })

        if (response.status === 400 || response.status === 500) {
            throw response.data
        }
        return response.data
    } catch (error) {
        toast.error("Something Went Wrong", { position: "bottom-right" })
        throw error;
    }
}

export const createUser = async (email, token) => {
    try {
        await api.post(`/user/register`, { email }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        toast.error("Something Went Wrong, Please try again", { position: "bottom-right" })
        throw error
    }
}

export const bookVisit = async (date, propertyId, email, token) => {
    try {
        await api.post(`/user/bookVisit/${propertyId}`, {
            email,
            id: propertyId,
            date: dayjs(date).format("DD/MM/YYYY")
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

    } catch (error) {
        toast.error("Something Went Wrong, Please try again", { position: "bottom-right" })
        throw error
    }
}

export const removeBooking = async (id, email, token) => {


    try {
        await api.post(`/user/removeBooking/${id}`,
            {
                email
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

    } catch (error) {
        toast.error("Something Went Wrong, Please try again", { position: "bottom-right" })
        throw error
    }

}

export const toFav = async (id, email, token) => {
    try {
        await api.post(`/user/toFav/${id}`,
            {
                email
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

    } catch (error) {
        toast.error("Something Went Wrong, Please try again", { position: "bottom-right" })
        throw error
    }
}

export const getAllFav = async (email, token) => {
    if (!token) return

    try {
        const res = await api.post(`/user/allFav`,
            {
                email,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // console.log(res)
        return res.data["favResidenciesID"]
    } catch (error) {
        toast.error("Something Went Wrong while fetching Favourites", { position: "bottom-right" })
        throw error
    }
}

export const getAllBookings = async (email, token) => {
    if (!token) return
    try {
        const res = await api.post(`/user/allBookings`,
            {
                email,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // console.log("res", res)
        return res.data["bookedVisits"]
    }
    catch (error) {
        toast.error("Something Went Wrong while fetching Bookings", { position: "bottom-right" })
        throw error
    }
}

export const createResidency = async (data, token) => {
    // console.log(data)
    try {
        const res = await api.post(
            `/residency/create`,
            {
                data
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
    }
    catch (error) {
        toast.error("Something Went Wrong while Creating Residency", { position: "bottom-right" })
        throw error
    }
}

export const updateResidency = async (id, data, token) => {
    console.log(data)

    try {
        await api.put(`/residency/updateResd/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    } catch (error) {
        toast.error("Something Went Wrong while Updating Residency", { position: "bottom-right" })
        throw error
    }
}

export const removeResidency = async (id, token) => {
    try {
        await api.delete(`/residency/delResd/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    catch (error) {
        toast.error("Something Went Wrong while Deleting Residency", { position: "bottom-right" })
        throw error
    }
}

