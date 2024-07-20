import jwtDecode from 'jwt-decode';
import { getTokenWithExpiry } from './tokenUtils';

export const checkToken = (setError, setLoading, setUserName, fetchUserData) => {
    const token = getTokenWithExpiry("token");
    if (token) {
        try {
            const decodedToken = jwtDecode(token);

            const now = Math.floor(Date.now() / 1000);
            if (decodedToken.exp && decodedToken.exp < now) {
                localStorage.removeItem("token");
                setError(new Error("Token has expired"));
                setLoading(false);
            } else if (decodedToken && decodedToken.flag) {
                setUserName(decodedToken.name);
                fetchUserData(decodedToken.id.id);
                setLoading(false);
            }
        } catch (error) {
            console.error("Failed to decode token:", error);
            localStorage.removeItem("token");
            setError(new Error("Invalid token"));
            setLoading(false);
        }
    } else {
        setLoading(false);
        setError(new Error("No token found"));
    }
};
