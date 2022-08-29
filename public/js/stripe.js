const stripe = Stripe('pk_test_51LVugISGF4nE7vqYqF4H2aV4gVKFmT3aIrATGwqMCw39fmQGnx76Ui9Fhc40NnNwX7ShRVIIISfkS2CWO0jwj5Mm001srHBwTK')

const pay = async orderId => {
    try {

        const session = await axios.get(`http://localhost:4000${orderId}`)
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });

    } catch (err) {
        console.log(err)
    }
}