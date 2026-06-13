import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';

const VoucherDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [voucher, setVoucher] = useState(null);
    const [relatedVouchers, setRelatedVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [voucherRes, allVouchersRes] = await Promise.all([
                    axiosInstance.get(`/vouchers/${id}`),
                    axiosInstance.get('/vouchers')
                ]);

                setVoucher(voucherRes.data);

                // Filter related vouchers by same category, excluding current one
                const related = allVouchersRes.data.filter(v =>
                    v._id !== id && (v.category?._id === voucherRes.data.category?._id || v.category === voucherRes.data.category?._id)
                ).slice(0, 4);
                setRelatedVouchers(related);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await axiosInstance.post('/cart', { voucherId: voucher._id, quantity: 1 });
            alert('Voucher added to cart!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding to cart');
        }
    };

    const copyCode = () => {
        if (!voucher) return;
        navigator.clipboard.writeText(voucher.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getDaysLeft = (date) => {
        const diff = new Date(date) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `EXPIRES IN ${days} DAYS` : 'EXPIRED';
    };

    if (loading) return <div className="pt-24 text-center font-body-md">Loading premium voucher...</div>;
    if (!voucher) return <div className="pt-24 text-center font-body-md text-error">Voucher not found.</div>;

    return (
        <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen">
            <style>
                {`
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .glass-effect { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        `}
            </style>

            <main className="max-w-container-max mx-auto px-gutter py-xl pt-24">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-sm mb-lg text-on-surface-variant">
                    <Link className="font-label-lg text-label-lg hover:text-primary" to="/">Home</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <Link className="font-label-lg text-label-lg hover:text-primary" to="/categories">
                        {typeof voucher.category === 'object' ? voucher.category.name : 'Categories'}
                    </Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="font-label-lg text-label-lg text-on-surface">{voucher.code} Details</span>
                </nav>

                {/* Voucher Hero Layout (Bento Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
                    {/* Left Side: Visual Assets */}
                    <div className="lg:col-span-7 flex flex-col gap-lg">
                        <div className="relative rounded-xl overflow-hidden shadow-sm group">
                            <img
                                className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
                                src="https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2070&auto=format&fit=crop"
                                alt="Voucher Hero"
                            />
                            <div className="absolute top-md left-md">
                                <span className="bg-secondary text-on-secondary px-md py-sm rounded-lg font-label-lg text-label-lg shadow-lg uppercase">
                                    {getDaysLeft(voucher.expiryDate)}
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-lg bg-gradient-to-t from-black/60 to-transparent">
                                <div className="flex items-center gap-md text-white">
                                    <div className="w-16 h-16 bg-white p-sm rounded-lg shadow-md flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
                                    </div>
                                    <div>
                                        <h1 className="font-headline-lg text-headline-lg leading-none">{voucher.code} Official</h1>
                                        <p className="font-body-md text-body-md opacity-90">Premium Point-to-Voucher Exchange</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Redemption Instructions */}
                        <div className="bg-surface-container-lowest rounded-xl p-xl shadow-sm border border-outline-variant">
                            <h2 className="font-headline-md text-headline-md mb-lg flex items-center gap-sm">
                                <span className="material-symbols-outlined text-primary">info</span>
                                Redemption Instructions
                            </h2>
                            <div className="space-y-md">
                                <div className="flex gap-md">
                                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold flex-shrink-0">1</span>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Copy the unique voucher code by clicking the "Copy" button in the sidebar.</p>
                                </div>
                                <div className="flex gap-md">
                                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold flex-shrink-0">2</span>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Navigate to your basket and click "Redeem Now" to confirm your point deduction.</p>
                                </div>
                                <div className="flex gap-md">
                                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold flex-shrink-0">3</span>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Your voucher will be saved to your History for permanent access.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Interaction Hub */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 space-y-lg">
                            {/* The Main Voucher Card */}
                            <div className="bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden border border-outline-variant flex flex-col">
                                <div className="p-xl text-center space-y-md">
                                    <span className="text-primary font-bold tracking-widest text-label-lg font-label-lg uppercase">Limited Time Offer</span>
                                    <h2 className="font-display-sm text-display-sm text-on-surface">${voucher.discountAmount} OFF Total</h2>
                                    <p className="text-on-surface-variant font-body-md text-body-md">
                                        {voucher.description || 'Exclusive discount available for your next purchase at participating retailers.'}
                                    </p>
                                </div>

                                {/* Coupon Cut-out Visual */}
                                <div className="relative h-4 flex items-center">
                                    <div className="absolute -left-2 w-4 h-4 rounded-full bg-surface border-r border-outline-variant"></div>
                                    <div className="w-full border-t-2 border-dashed border-outline-variant"></div>
                                    <div className="absolute -right-2 w-4 h-4 rounded-full bg-surface border-l border-outline-variant"></div>
                                </div>

                                <div className="p-xl bg-surface-container-low space-y-lg">
                                    {/* Copy Component */}
                                    <div className="space-y-sm">
                                        <label className="font-label-md text-label-md text-on-surface-variant block ml-1 uppercase">Voucher Code</label>
                                        <div className="relative group">
                                            <input
                                                className={`w-full bg-white border rounded-lg px-md py-lg font-code text-code text-primary focus:outline-none transition-all cursor-default ${copied ? 'border-green-500 ring-2 ring-green-500' : 'border-outline-variant focus:border-primary'}`}
                                                readOnly
                                                type="text"
                                                value={voucher.code}
                                            />
                                            <button
                                                onClick={copyCode}
                                                className={`absolute right-md top-1/2 -translate-y-1/2 px-lg py-sm rounded-lg font-label-lg text-label-lg transition-all flex items-center gap-xs text-white ${copied ? 'bg-green-600' : 'bg-primary hover:bg-primary-container'}`}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {copied ? 'check' : 'content_copy'}
                                                </span>
                                                {copied ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-secondary text-on-secondary py-lg rounded-xl font-headline-md text-headline-md shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-md"
                                    >
                                        Add to Cart
                                        <span className="material-symbols-outlined">add_shopping_cart</span>
                                    </button>

                                    <div className="flex items-center justify-between px-sm">
                                        <div className="flex items-center gap-xs text-secondary">
                                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                                            <span className="font-label-lg text-label-lg">Ends {new Date(voucher.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-xs text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[20px]">group</span>
                                            <span className="font-label-lg text-label-lg">Trending Offer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Bar */}
                            <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant flex items-center justify-around">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-primary text-[32px] block mb-xs">verified</span>
                                    <span className="font-label-md text-label-md">Verified</span>
                                </div>
                                <div className="w-[1px] h-12 bg-outline-variant"></div>
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-primary text-[32px] block mb-xs">bolt</span>
                                    <span className="font-label-md text-label-md">Instant</span>
                                </div>
                                <div className="w-[1px] h-12 bg-outline-variant"></div>
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-primary text-[32px] block mb-xs">security</span>
                                    <span className="font-label-md text-label-md">Secure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms & Conditions Section */}
                <div className="mt-2xl">
                    <div className="bg-surface-container-low rounded-xl p-xl max-w-3xl border border-outline-variant/30">
                        <h3 className="font-headline-md text-headline-md mb-lg">Terms & Conditions</h3>
                        <ul className="space-y-sm list-disc pl-lg font-body-sm text-body-sm text-on-surface-variant">
                            <li>Redemption requires a valid VoucherHub account and sufficient loyalty points.</li>
                            <li>Vouchers are non-transferable and cannot be exchanged for cash currency.</li>
                            <li>Expiry dates are final; please ensure redemption before the stated date.</li>
                            <li>VoucherHub acts as a hybrid platform and is not liable for merchant-side inventory issues.</li>
                        </ul>
                    </div>
                </div>

                {/* Related Deals Section */}
                {relatedVouchers.length > 0 && (
                    <div className="mt-2xl border-t border-outline-variant pt-2xl">
                        <div className="flex justify-between items-end mb-xl">
                            <div>
                                <h2 className="font-headline-lg text-headline-lg">More from this Category</h2>
                                <p className="text-on-surface-variant font-body-md text-body-md">Hand-picked deals based on your browsing history</p>
                            </div>
                            <Link to="/categories" className="text-primary font-label-lg text-label-lg flex items-center gap-xs hover:underline">
                                View All Deals <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                            {relatedVouchers.map(v => (
                                <div key={v._id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden group hover:shadow-md transition-all">
                                    <div className="h-48 relative overflow-hidden bg-blue-50 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[48px] text-primary/30 group-hover:scale-110 transition-transform duration-500">confirmation_number</span>
                                        <div className="absolute top-sm right-sm bg-primary text-on-primary px-sm py-xs rounded font-label-md text-label-md">
                                            ${v.discountAmount} OFF
                                        </div>
                                    </div>
                                    <div className="p-md">
                                        <h4 className="font-headline-md text-headline-md truncate">{v.code} Sale</h4>
                                        <p className="text-on-surface-variant font-body-sm text-body-sm mb-md line-clamp-1">Redeemable for {v.discountAmount * 10} Points</p>
                                        <Link
                                            to={`/voucher/${v._id}`}
                                            className="w-full bg-secondary text-on-secondary py-sm rounded-lg font-label-lg text-label-lg hover:opacity-90 block text-center"
                                        >
                                            View Detail
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default VoucherDetail;