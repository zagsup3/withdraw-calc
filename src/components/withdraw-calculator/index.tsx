"use client";
import { useEffect, useState } from "react";
import CopyIcon from "@/../public/copy.png";
import CheckIcon from "@/../public/check.png";
import SettingIcon from "@/../public/setting.png";
import Image from "next/image";
import Settings, { VATSettingsType } from "./settings";
const DEFAULT_VAT_SETTINGS: VATSettingsType = [
    { limit: 50000, vat: 2.5 },
    { limit: 0, vat: 5 },
];
const DEFAULT_USDT_RATE = 281;
const WithdrawCalculator = () => {
    const [username, setUsername] = useState("");
    const [amount, setAmount] = useState("");
    const [isUSDT, setIsUSDT] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [copyIcon, setCopyIcon] = useState(CopyIcon);
    const [vatData, setVatData] = useState<VATSettingsType>(DEFAULT_VAT_SETTINGS);
    const [usdtRate, setUsdtRate] = useState(DEFAULT_USDT_RATE);
    const CalculateUSDTWithdrawal = (usd: number) => {
        const vat = vatData.find(item => usd >= item.limit)?.vat || 2.5;
        const vatUSD = Math.round((usd / 100) * vat);
        const result = `${usd.toLocaleString()} USDT Withdrawal<br/>${(
            usd * usdtRate
        ).toLocaleString()} PKR<br/>($${vatUSD.toLocaleString()} PKR ${(
            vatUSD * usdtRate
        ).toLocaleString()} VAT ${vat}%)<br/>Amount after VAT : $${(usd - vatUSD).toLocaleString()}<br/>${username}`;
        const el = document.getElementById("result");
        if (el) {
            el.innerHTML = result;
        }
    };
    const CalculateJCWithdrawal = (JC: number) => {
        const vat = vatData.find(item => JC / usdtRate >= item.limit)?.vat || 2.5;
        const vatJC = Math.round((JC / 100) * vat);
        const result = `${JC.toLocaleString()} PKR Withdrawal<br/>(PKR ${vatJC.toLocaleString()}, VAT ${vat}%)<br/>Amount after VAT : PKR ${(
            JC - vatJC
        ).toLocaleString()}<br/>${username}`;
        const el = document.getElementById("result");
        if (el) {
            el.innerHTML = result;
        }
    };
    const Calculate = () => {
        return !!username && !!amount
            ? isUSDT
                ? CalculateUSDTWithdrawal(Number(amount))
                : CalculateJCWithdrawal(Number(amount))
            : console.log("");
    };
    useEffect(() => {
        const vat = localStorage.getItem("vatSettings");
        const usdtRate = localStorage.getItem("usdtRate");
        if (vat) setVatData(JSON.parse(vat));
        if (usdtRate) setUsdtRate(Number(usdtRate));
        else {
            localStorage.setItem("vatSettings", JSON.stringify(DEFAULT_VAT_SETTINGS));
        }
    }, []);
    return (
        <div className="withdraw-calc-wrapper">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold py-2">Withdraw Calculator</h1>
                <button
                    className="cursor-pointer"
                    onClick={() => {
                        setIsSettingsOpen(prev => !prev);
                    }}
                >
                    <Image src={SettingIcon} alt="setting" width={20} height={20} />
                </button>
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    Calculate();
                }}
                onReset={() => {
                    setUsername("");
                    setAmount("");
                    setIsUSDT(true);
                    const el = document.getElementById("result");
                    if (el) {
                        el.innerHTML = "";
                    }
                }}
            >
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={e => {
                        setUsername(e.target.value);
                    }}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => {
                        setAmount(e.target.value);
                    }}
                />
                <div>
                    <input
                        type="checkbox"
                        checked={isUSDT}
                        onChange={e => {
                            setIsUSDT(e.target.checked);
                        }}
                    />
                    <span className="ml-2">USDT</span>
                </div>
                <div className="flex justify-evenly gap-2 mt-2">
                    <button type="reset" className="cursor-pointer bg-red-800 text-white px-8 py-2 rounded w-full">
                        Reset
                    </button>
                    <button type="submit" className="cursor-pointer bg-blue-800 text-white px-8 py-2 rounded w-full">
                        Calculate
                    </button>
                </div>
            </form>
            <div className="rounded mt-4 bg-green-900 overflow-hidden">
                <div className="bg-green-700 p-2 flex justify-between items-center">
                    <div>Result:</div>
                    <button
                        onClick={() => {
                            setCopyIcon(CheckIcon);
                            const text = document.getElementById("result")?.innerText;
                            navigator.clipboard.writeText(text || "");
                            setTimeout(() => {
                                setCopyIcon(CopyIcon);
                            }, 1200);
                        }}
                        className="cursor-pointer"
                    >
                        <Image src={copyIcon} alt="copy" width={20} height={20} />
                    </button>
                </div>
                <div id="result" className="p-2 min-h-[140px]"></div>
            </div>
            <Settings
                vat={vatData}
                open={isSettingsOpen}
                onClose={() => {
                    setIsSettingsOpen(false);
                }}
                updateVAT={val => {
                    setVatData(val);
                }}
                usdtRate={usdtRate}
                updateUsdtRate={val => setUsdtRate(Number(val))}
            />
        </div>
    );
};
export default WithdrawCalculator;
