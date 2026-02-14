import api from '../api';

const usePayment = (onSuccess) => {
    const handlePayment = async (rent) => {
        if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
            alert('Razorpay Key ID is not configured. Please check your .env file in the frontend directory.');
            return;
        }
        try {
            // 1. Create Order on Backend
            const orderRes = await api.post(`activity/rents/${rent.id}/create-payment/`);
            const { id: order_id, amount, currency } = orderRes.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "HostelHub",
                description: `Rent for ${rent.month}`,
                order_id: order_id,
                handler: async (response) => {
                    // 3. Verify Payment on Backend
                    try {
                        await api.post(`activity/rents/${rent.id}/verify-payment/`, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        alert('Payment Successful!');
                        if (onSuccess) onSuccess();
                    } catch (err) {
                        alert('Verification failed');
                    }
                },
                prefill: {
                    name: "Student Name",
                    email: "student@example.com",
                },
                theme: { color: "#2563eb" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert('Failed to initiate payment');
        }
    };

    return { handlePayment };
};

export default usePayment;
