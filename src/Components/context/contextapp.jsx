import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const MyContext = createContext();

const MyProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return storedLang ? storedLang : 'TH'
    });
    const [dictionary, setDictionary] = useState([])
    const [contactdata, setContactdata] = useState(1)
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    useEffect(() => {
        const saved = localStorage.getItem('selectedMenuItem');
        if (saved) {
            setSelectedMenuItem(JSON.parse(saved));
        }
    }, []);
    useEffect(() => {
        if (selectedMenuItem) {
            localStorage.setItem('selectedMenuItem', JSON.stringify(selectedMenuItem));
        }
    }, [selectedMenuItem]);

    useEffect(() => {
        const Getdic = async () => {
            try {
                const dic = await axios.get(import.meta.env.VITE_API_Dics)
                // console.log(dic, 'dic');

                if (dic.status === 200) {
                    setDictionary(dic.data)
                }
            } catch (error) {
                return error
            }
        }
        Getdic();
    }, [])


    const lang_keyword = (keyword, keylang = null) => {
        const data_res = dictionary.filter((item) => item.Lang_Code === keyword);

        // Check if data_res contains the keyword
        if (data_res.length > 0) {
            const data_item = data_res[0];

            // If keylang is provided, return the corresponding value for TH or EN directly
            if (keylang) {
                // Only check for 'TH' or 'EN', return that specific value
                if (keylang === 'TH' || keylang === 'EN') {
                    return data_item[`Lang_${keylang}`] ? data_item[`Lang_${keylang}`] : `[${keyword}]`;
                }
            }

            // If keylang is not provided, check based on the current language
            const data_no_code_and_id = Object.fromEntries(
                Object.entries(data_item).filter(([key]) => key !== 'Lang_Code')
            );

            // Loop through keys to match with current language and return the value
            for (const key of Object.keys(data_no_code_and_id)) {
                if (lang === key.split("_")[1]) {
                    return data_item[key] ? data_item[key] : `[${keyword}]`;
                }
            }
        }

        // Fallback if no matching language is found
        return `[${keyword}]`;
    };
    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    return (
        <MyContext.Provider value={{ lang, setLang, lang_keyword, contactdata, setContactdata, selectedMenuItem, setSelectedMenuItem }}>
            {children}
        </MyContext.Provider>
    )
}

export default MyProvider