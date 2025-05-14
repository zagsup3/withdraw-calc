"use client";
import { useEffect, useState } from "react";
import AddIcon from "@/../public/add.png";
import DeleteIcon from "@/../public/delete.png";
import Image from "next/image";
export type VATSettingsType = {
    limit: number;
    vat: number;
}[];
const Settings = ({
    vat,
    open,
    onClose,
    updateVAT,
    usdtRate,
    updateUsdtRate,
}: {
    vat: VATSettingsType;
    open: boolean;
    onClose: () => void;
    updateVAT: (val: VATSettingsType) => void;
    usdtRate: number;
    updateUsdtRate: (val: string) => void;
}) => {
    const [vatSettings, setVatSettings] = useState<VATSettingsType>([]);
    const updateVatEntry = (index: number, key: "limit" | "vat", val: number) => {
        const updatedArr = Array.from(vatSettings);
        updatedArr[index][key] = val;
        setVatSettings(updatedArr);
        localStorage.setItem("vatSettings", JSON.stringify(updatedArr));
        updateVAT(updatedArr);
    };
    const deleteVatEntry = (index: number) => {
        const updatedArr = Array.from(vatSettings).filter((_item, i) => i !== index);
        setVatSettings(updatedArr);
        localStorage.setItem("vatSettings", JSON.stringify(updatedArr));
        updateVAT(updatedArr);
    };
    useEffect(() => {
        setVatSettings(vat);
    }, [vat]);
    return (
        <div
            className={`sidebar-wrapper fixed inset-0 p-3 translate-x-[${
                !!open ? "0%" : "100%"
            }] transition-all flex justify-end`}
            onClick={() => {
                onClose();
            }}
        >
            <div
                className={`sidebar bg-black p-3 z-10`}
                onClick={e => {
                    e.stopPropagation();
                }}
            >
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold py-2 mb-1">Settings</h1>
                    <button
                        onClick={() => {
                            onClose();
                        }}
                        className="cursor-pointer"
                    >
                        close
                    </button>
                </div>
                <h1 className="font-semibold py-2 mb-1">VAT</h1>
                <div className="flex justify-evenly gap-2 mb-2">
                    <label className="w-full">Limit</label>
                    <label className="w-full">VAT %</label>
                    <button
                        className="rounded-full flex justify-center items-center cursor-pointer"
                        onClick={() => {
                            updateVAT([{ limit: 0, vat: 0 }, ...vatSettings]);
                        }}
                    >
                        <Image src={AddIcon} alt="delete entry" width={60} height={60} />
                    </button>
                </div>
                {vatSettings.map((item, index) => (
                    <div key={index} className="flex justify-evenly gap-2 mb-2 items-center">
                        <input
                            type="number"
                            placeholder="Limit"
                            value={item.limit}
                            onChange={e => updateVatEntry(index, "limit", Number(e.target.value))}
                        />
                        <input
                            type="number"
                            placeholder="VAT"
                            value={item.vat}
                            onChange={e => updateVatEntry(index, "vat", Number(e.target.value))}
                        />
                        <button
                            className="rounded-full flex justify-center items-center cursor-pointer"
                            onClick={() => {
                                deleteVatEntry(index);
                            }}
                        >
                            <Image src={DeleteIcon} alt="delete entry" width={60} height={60} />
                        </button>
                    </div>
                ))}
                <hr className="mt-4 mb-2" />
                <div>
                    <h1 className="font-semibold py-2 mb-1">1 USDT to PKR</h1>
                    <input
                        type="number"
                        placeholder="Limit"
                        value={usdtRate}
                        onChange={e => {
                            localStorage.setItem("usdtRate", e.target.value);
                            updateUsdtRate(e.target.value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default Settings;
