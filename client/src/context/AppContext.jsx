import axios from 'axios'
import { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext()

export const AppProvider = ({ children }) =>{

    const currency = import.meta.env.VITE_CURRENCY || "$"
    const navigate = useNavigate()
    const { user } = useUser()
    const { getToken } = useAuth()
    const [isOwner, setIsOwner] = useState(false)
    const [showHotelReg, setShowHotelReg] = useState(false)
    const [searchedCities ,setsearchedCities] = useState([])

    const fetchUser = async () => {
  try {
    const token = await getToken();
    if (!token) {
      console.warn("No token found. Retrying in 5s...");
      setTimeout(fetchUser, 5000);
      return;
    }

    const { data } = await axios.get('/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (data.success) {
      setIsOwner(data.role === 'hotelOwner');
      setsearchedCities(data.recentSearchedCities);
    }
  } catch (error) {
    console.error("Fetch user failed:", error.response?.data || error.message);
    toast.error(error.response?.data?.error || error.message);
  }
};


    useEffect(() =>{
        if(user){
            fetchUser()
        }
    }, [user])

    const value ={
        currency, navigate, user, getToken, isOwner, setIsOwner, axios, showHotelReg, setShowHotelReg, searchedCities, setsearchedCities
    }

    return (
        <AppContext.Provider value={value}>
                {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)

