'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Header } from '../components/header';
import styles from './subscription.module.css';

export default function Search() {
    const { user } = useUser();
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const email = user.primaryEmailAddress?.emailAddress;
            if (email) {
                const fetchSubscriptions = async () => {
                    try {
                        const response = await fetch(`https://autoreader-backend.ed-aisys.com/api/subscribe/get?user_email=${encodeURIComponent(email)}`, {
                            headers: {
                                'accept': 'application/json'
                            }
                        });
                        if (!response.ok) {
                            throw new Error('Failed to fetch subscriptions');
                        }
                        const data = await response.json();
                        console.log(data);
                        setSubscriptions(data.subscriptions);
                    } catch (error: any) {
                        setError(error.message);
                    } finally {
                        setLoading(false);
                    }
                };

                fetchSubscriptions();
            } else {
                setLoading(false);
                setError('User email not found');
            }
        }
    }, [user]);

    const handleEdit = (subscription: any) => {
        // Logic for editing the subscription
        console.log('Edit subscription:', subscription);
        // Refresh page
        window.location.reload();
    };

    const handleDelete = (subscription: any) => {
        // Logic for deleting the subscription
        console.log('Delete subscription:', subscription);
        const email = user?.primaryEmailAddress?.emailAddress;

        const deleteSubscription = async () => {
            try {
                const response = await fetch('https://autoreader-backend.ed-aisys.com/api/subscribe/remove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_email: email, query: subscription }),
                });
                // if (!response.ok) {
                //     throw new Error('Failed to delete subscription');
                // }
            } catch (error: any) {
                console.error(error.message);
                // alert('Failed to delete subscription');
            }
        }

        deleteSubscription();
        // Refresh page
        window.location.reload();
    };

    return (
        <div className={styles.container}>
            <Header />
            {user ? (
                <div>
                    <h1 className={styles.header}></h1>
                    {loading ? (
                        <p className={styles.loading}>Loading...</p>
                    ) : error ? (
                        <p className={styles.error}>Error: {error}</p>
                    ) : (
                        <div>
                            {subscriptions.length > 0 ? (
                                <ul>
                                    {subscriptions.map((subscription, index) => (
                                        <li key={index} className={styles.card}>
                                            <div className={styles.cardContent}>
                                                {index + 1} - {subscription}
                                            </div>
                                            <div className={styles.cardActions}>
                                                {/* <button className={styles.button} onClick={() => handleEdit(subscription)}>Edit</button> */}
                                                <button className={styles.button} onClick={() => handleDelete(subscription)}>Delete</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No subscriptions found.</p>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h1>Please sign in for more details.</h1>
                </div>
            )}
        </div>
    );
}
