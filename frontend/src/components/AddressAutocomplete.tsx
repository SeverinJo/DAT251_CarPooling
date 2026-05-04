import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import type { AddressResponse } from "../api/generated/models/AddressResponse";
import { searchAddress } from "../api/api";

type Props = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

function formatFull(a: AddressResponse): string {
    const street = [a.addressName, a.number, a.letter].filter(Boolean).join(" ");
    return `${street}, ${a.city}`;
}

function formatStreet(a: AddressResponse): string {
    return `${a.addressName}, ${a.city}`;
}

function deduplicateByStreet(addresses: AddressResponse[]): AddressResponse[] {
    const seen = new Set<string>();
    return addresses.filter(a => {
        const key = `${a.addressName}|${a.city}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export default function AddressAutocomplete({ label, value, onChange, placeholder }: Props) {
    const [input, setInput] = useState(value);
    const [options, setOptions] = useState<AddressResponse[]>([]);

    const hasNumber = /\d/.test(input);
    const displayOptions = hasNumber ? options : deduplicateByStreet(options);

    // Debounce: wait 300ms after user stops typing before calling the API
    useEffect(() => {
        if (input.length < 3) {
            setOptions([]);
            return;
        }
        const timer = setTimeout(() => {
            searchAddress(input)
                .then(setOptions)
                .catch(() => setOptions([]));
        }, 300);

        return () => clearTimeout(timer);
    }, [input]);

    return (
        <Autocomplete
            freeSolo
            options={displayOptions}
            filterOptions={(x) => x}
            getOptionLabel={(option) =>
                typeof option === "string" ? option : (hasNumber ? formatFull(option) : formatStreet(option))
            }
            inputValue={input}
            onInputChange={(_, newInput) => {
                setInput(newInput);
                onChange(newInput);
            }}
            onChange={(_, selected) => {
                if (selected && typeof selected !== "string") {
                    const formatted = hasNumber ? formatFull(selected) : formatStreet(selected);
                    setInput(formatted);
                    onChange(formatted);
                }
            }}
            renderInput={(params) => (
                <TextField {...params} label={label} fullWidth placeholder={placeholder} />
            )}
        />
    );
}
