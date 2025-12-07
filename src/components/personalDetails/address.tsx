import styles from "@/app/dashboard/trainer/personalDetails/personalDetails.module.css";
import { useEffect, useState } from "react";

export default function AddressCard({ addressQuery, setAddressQuery, trainerAddress, setTrainerAddress }:
    { addressQuery: string, setAddressQuery: any, trainerAddress: string, setTrainerAddress: any }) {

    const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressError, setAddressError] = useState<string | null>(null);

    useEffect(() => {
        if (!addressQuery || addressQuery.trim().length < 3) {
            setAddressSuggestions([]);
            return;
        }

        const controller = new AbortController();
        const debounce = setTimeout(async () => {
            try {
                setAddressLoading(true);
                setAddressError(null);

                // בניית כתובת ה-URL ל־Geoapify עם query וה־API key
                const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                    addressQuery
                )}&lang=he&limit=5&types=street,locality,housenumber&apiKey=1ab0a67899de4c979ee070413cd49be2`;

                const res = await fetch(url, { signal: controller.signal });
                console.log("Fetch response status:", res.status);

                if (!res.ok) {
                    throw new Error(`Failed to fetch, status: ${res.status}`);
                }

                const data = await res.json();

                const suggestions =
                    data?.features?.map((f: any) => {
                        const street = f.properties.street || "";
                        const number = f.properties.housenumber || "";
                        const city = f.properties.city || "";

                        return `${street} ${number}, ${city}`.trim();
                    }) ?? [];


                setAddressSuggestions(suggestions);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    setAddressError("לא ניתן לטעון הצעות כתובות כרגע");
                    setAddressSuggestions([]);
                }
            } finally {
                setAddressLoading(false);
            }

        }, 400);

        return () => {
            clearTimeout(debounce);
            controller.abort();
        };
    }, [addressQuery]);

    return (
        <div className={styles.trainerWrapper}>

            <label>כתובת:</label>
            <input
                type="text"
                className={styles.inputCommon}
                value={trainerAddress}
                list="trainer-addresses"
                onChange={(e) => {
                    setTrainerAddress(e.target.value);
                    setAddressQuery(e.target.value);
                }}
                placeholder="התחל להקליד כתובת"
            />
            <datalist id="trainer-addresses">
                {addressSuggestions.map((suggestion, idx) => (
                    <option key={`${suggestion}-${idx}`} value={suggestion} />
                ))}
            </datalist>
            {addressLoading && <small>טוען הצעות...</small>}
            {addressError && <small className={styles.errorText}>{addressError}</small>}

        </div>
    );
}