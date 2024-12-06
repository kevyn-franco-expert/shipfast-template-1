// import {NextRequest, NextResponse} from "next/server";
// import {headers} from "next/headers";
// import Stripe from "stripe";
// import {SupabaseClient} from "@supabase/supabase-js";
// import configFile from "@/config";
// import {findCheckoutSession} from "@/libs/stripe";
//
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: "2023-08-16",
//     typescript: true,
// });
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
//
// // This is where we receive Stripe webhook events
// // It used to update the user data, send emails, etc...
// // By default, it'll store the user in the database
// // See more: https://shipfa.st/docs/features/payments
// export async function POST(req: NextRequest) {
//     const body = await req.text();
//
//     const signature = headers().get("stripe-signature");
//
//     let eventType;
//     let event;
//
//     // Create a private supabase client using the secret service_role API key
//     const supabase = new SupabaseClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL,
//         process.env.SUPABASE_SERVICE_ROLE_KEY
//     );
//
//
//     console.log(body, signature, webhookSecret)
//
//     // verify Stripe event is legit
//     try {
//         event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//     } catch (err) {
//         console.error(`Webhook signature verification failed. ${err.message}`);
//         return NextResponse.json({error: err.message}, {status: 400});
//     }
//
//     eventType = event.type;
//
//     try {
//         switch (eventType) {
//             case "checkout.session.completed": {
//                 console.log('TEST');
//                 // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
//                 // ✅ Grant access to the product
//                 const stripeObject: Stripe.Checkout.Session = event.data
//                     .object as Stripe.Checkout.Session;
//
//                 const session = await findCheckoutSession(stripeObject.id);
//
//                 const customerId = session?.customer;
//                 const priceId = session?.line_items?.data[0]?.price.id;
//                 const userId = stripeObject.client_reference_id;
//                 const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);
//
//                 if (!plan) break;
//
//                 // Update the profile where id equals the userId (in table called 'profiles') and update the customer_id, price_id, and has_access (provisioning)
//                 await supabase
//                     .from("profiles")
//                     .update({
//                         customer_id: customerId,
//                         price_id: priceId,
//                         has_access: true,
//                     })
//                     .eq("id", userId);
//
//                 // Extra: send email with user link, product page, etc...
//                 // try {
//                 //   await sendEmail(...);
//                 // } catch (e) {
//                 //   console.error("Email issue:" + e?.message);
//                 // }
//
//                 break;
//             }
//
//             case "checkout.session.expired": {
//                 console.log('TEST2');
//
//                 // User didn't complete the transaction
//                 // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
//                 break;
//             }
//
//             case "customer.subscription.updated": {
//                 console.log('TEST3');
//
//                 // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
//                 // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
//                 // You can update the user data to show a "Cancel soon" badge for instance
//                 break;
//             }
//
//             case "customer.subscription.deleted": {
//                 console.log('TEST4');
//
//                 // The customer subscription stopped
//                 // ❌ Revoke access to the product
//                 const stripeObject: Stripe.Subscription = event.data
//                     .object as Stripe.Subscription;
//                 const subscription = await stripe.subscriptions.retrieve(
//                     stripeObject.id
//                 );
//
//                 await supabase
//                     .from("profiles")
//                     .update({has_access: false})
//                     .eq("customer_id", subscription.customer);
//                 break;
//             }
//
//             case "invoice.paid": {
//                 console.log('TEST4');
//
//                 // Customer just paid an invoice (for instance, a recurring payment for a subscription)
//                 // ✅ Grant access to the product
//                 const stripeObject: Stripe.Invoice = event.data
//                     .object as Stripe.Invoice;
//                 const priceId = stripeObject.lines.data[0].price.id;
//                 const customerId = stripeObject.customer;
//
//                 // Find profile where customer_id equals the customerId (in table called 'profiles')
//                 const {data: profile} = await supabase
//                     .from("profiles")
//                     .select("*")
//                     .eq("customer_id", customerId)
//                     .single();
//
//                 // Make sure the invoice is for the same plan (priceId) the user subscribed to
//                 if (profile.price_id !== priceId) break;
//
//                 // Grant the profile access to your product. It's a boolean in the database, but could be a number of credits, etc...
//                 await supabase
//                     .from("profiles")
//                     .update({has_access: true})
//                     .eq("customer_id", customerId);
//
//                 break;
//             }
//
//             case "invoice.payment_failed":
//                 console.log('TEST5');
//
//                 // A payment failed (for instance the customer does not have a valid payment method)
//                 // ❌ Revoke access to the product
//                 // ⏳ OR wait for the customer to pay (more friendly):
//                 //      - Stripe will automatically email the customer (Smart Retries)
//                 //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired
//
//                 break;
//
//             default:
//                 console.log('TEST6');
//
//             // Unhandled event type
//         }
//     } catch (e) {
//         console.error("stripe error: ", e.message);
//     }
//
//     return NextResponse.json({});
// }


// import {NextRequest, NextResponse} from "next/server";
// import Stripe from "stripe";
// import {SupabaseClient} from "@supabase/supabase-js";
// import configFile from "@/config";
// import {findCheckoutSession} from "@/libs/stripe";
//
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: "2023-08-16",
//     typescript: true,
// });
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
//
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };
//
// async function readableStreamToBuffer(readableStream: ReadableStream): Promise<Buffer> {
//     const reader = readableStream.getReader();
//     const chunks: Uint8Array[] = [];
//     let done = false;
//
//     while (!done) {
//         const {value, done: readerDone} = await reader.read();
//         if (value) {
//             chunks.push(value);
//         }
//         done = readerDone;
//     }
//
//     return Buffer.concat(chunks);
// }
//
//
// // Este es el punto donde recibimos eventos de Stripe Webhooks
// export async function POST(req: NextRequest) {
//     let event;
//     const supabase = new SupabaseClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL,
//         process.env.SUPABASE_SERVICE_ROLE_KEY
//     );
//
//     try {
//         // Obtén el cuerpo crudo como un buffer
//         const rawBody = await readableStreamToBuffer(req.body)
//         const signature = req.headers.get("stripe-signature");
//
//         console.log("Cuerpo crudo:", rawBody.toString());
//         console.log("Firma:", signature);
//         console.log("Webhook Secret:", webhookSecret);
//
//         // Verifica el evento con Stripe
//         event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
//     } catch (err) {
//         console.error(`Error verificando la firma del webhook: ${err.message}`);
//         return NextResponse.json({error: "Webhook signature verification failed"}, {status: 400});
//     }
//
//     const eventType = event.type;
//
//     try {
//         switch (eventType) {
//             case "checkout.session.completed": {
//                 console.log("✅ TEST: checkout.session.completed");
//                 const stripeObject: Stripe.Checkout.Session = event.data.object as Stripe.Checkout.Session;
//
//                 const session = await findCheckoutSession(stripeObject.id);
//
//                 const customerId = session?.customer;
//                 const priceId = session?.line_items?.data[0]?.price.id;
//                 const userId = stripeObject.client_reference_id;
//                 const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);
//
//                 if (!plan) break;
//
//                 await supabase
//                     .from("profiles")
//                     .update({
//                         customer_id: customerId,
//                         price_id: priceId,
//                         has_access: true,
//                     })
//                     .eq("id", userId);
//
//                 break;
//             }
//
//             case "checkout.session.expired":
//                 console.log("🕒 TEST: checkout.session.expired");
//                 break;
//
//             case "customer.subscription.updated":
//                 console.log("🔄 TEST: customer.subscription.updated");
//                 break;
//
//             case "customer.subscription.deleted": {
//                 console.log("❌ TEST: customer.subscription.deleted");
//                 const stripeObject: Stripe.Subscription = event.data.object as Stripe.Subscription;
//                 const subscription = await stripe.subscriptions.retrieve(stripeObject.id);
//
//                 await supabase
//                     .from("profiles")
//                     .update({has_access: false})
//                     .eq("customer_id", subscription.customer);
//                 break;
//             }
//
//             case "invoice.paid": {
//                 console.log("💳 TEST: invoice.paid");
//                 const stripeObject: Stripe.Invoice = event.data.object as Stripe.Invoice;
//                 const priceId = stripeObject.lines.data[0].price.id;
//                 const customerId = stripeObject.customer;
//
//                 const {data: profile} = await supabase
//                     .from("profiles")
//                     .select("*")
//                     .eq("customer_id", customerId)
//                     .single();
//
//                 if (profile.price_id !== priceId) break;
//
//                 await supabase
//                     .from("profiles")
//                     .update({has_access: true})
//                     .eq("customer_id", customerId);
//
//                 break;
//             }
//
//             case "invoice.payment_failed":
//                 console.log("❌ TEST: invoice.payment_failed");
//                 break;
//
//             default:
//                 console.log(`⚠️ Evento no manejado: ${eventType}`);
//         }
//     } catch (err) {
//         console.error("Error en el manejo del webhook:", err.message);
//     }
//
//     return NextResponse.json({received: true});
// }


import {NextRequest, NextResponse} from "next/server";
import Stripe from "stripe";
import configFile from "@/config";
import {findCheckoutSession} from "@/libs/stripe";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
    typescript: true,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

async function readableStreamToBuffer(readableStream: ReadableStream): Promise<Buffer> {
    const reader = readableStream.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
        const {value, done: readerDone} = await reader.read();
        if (value) {
            chunks.push(value);
        }
        done = readerDone;
    }

    return Buffer.concat(chunks);
}


export async function POST(req: NextRequest) {
    const supabase = createClientComponentClient();


    let user_id_auth = '' // TODO arreglar este proceso.
    let event;

    try {
        const rawBody = await readableStreamToBuffer(req.body);
        const eventData = JSON.parse(rawBody.toString());

        console.log("Cuerpo crudo:", eventData);

        event = {
            type: eventData.type,
            data: eventData.data,
        };

    } catch (err) {
        console.error(`Error procesando el webhook: ${err.message}`);
        return NextResponse.json({error: "Error procesando el webhook"}, {status: 400});
    }

    const eventType = event.type;

    try {
        switch (eventType) {
            case "checkout.session.completed": {
                console.log("✅ TEST: checkout.session.completed");
                const stripeObject: Stripe.Checkout.Session = event.data.object as Stripe.Checkout.Session;

                const session = await findCheckoutSession(stripeObject.id);

                const customerId = session?.customer;
                const priceId = session?.line_items?.data[0]?.price.id;
                // const userId = stripeObject.client_reference_id;
                const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);

                if (!plan) break;

                await supabase
                    .from("users")
                    .update({
                        customer_id: customerId,
                        price_id: priceId,
                        has_access: true,
                    })
                    .eq("user_id", user_id_auth);

                break;
            }

            case "checkout.session.expired":
                console.log("🕒 TEST: checkout.session.expired");
                break;

            case "customer.subscription.updated":
                console.log("🔄 TEST: customer.subscription.updated");
                break;

            case "customer.subscription.deleted": {
                console.log("❌ TEST: customer.subscription.deleted");
                const stripeObject: Stripe.Subscription = event.data.object as Stripe.Subscription;
                const subscription = await stripe.subscriptions.retrieve(stripeObject.id);

                await supabase
                    .from("users")
                    .update({has_access: false})
                    .eq("customer_id", subscription.customer);
                break;
            }

            case "invoice.paid": {
                console.log("💳 TEST: invoice.paid");
                const stripeObject: Stripe.Invoice = event.data.object as Stripe.Invoice;
                const customerId = stripeObject.customer;
                // const priceId = stripeObject.lines.data[0]?.price.id;
                // const {data: profile} = await supabase
                //     .from("users")
                //     .select("*")
                //     .eq("customer_id", customerId)
                //     .single();
                // if (profile.price_id !== priceId) break;


                await supabase
                    .from("users")
                    .update({has_access: true})
                    .eq("customer_id", customerId);

                break;
            }

            case "invoice.payment_failed":
                console.log("❌ TEST: invoice.payment_failed");
                break;

            default:
                console.log(`⚠️ Evento no manejado: ${eventType}`);
        }
    } catch (err) {
        console.error("Error en el manejo del webhook:", err.message);
    }

    return NextResponse.json({received: true});
}