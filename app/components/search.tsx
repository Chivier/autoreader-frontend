'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import styles from './search.module.css';

export function Search() {
    const { user } = useUser();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        setIsClient(true);

        if (isClient) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isClient]);

    const handleSearch = async (searchQuery) => {
        const level = "general"; // Set the level here
        const response = await fetch('https://autoreader-backend.ed-aisys.com/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: searchQuery, level: level }),
        });
        const data = await response.json();
        setResults(data.papers); // Based on your comment, the results are in the "papers" field
    };

    function calculateTimeLeft() {
        const deadline = new Date('June 09, 2024 12:00:00');
        const now = new Date();
        const difference = deadline - now;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    }

    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>
                Semantic Search in today's arXiv Papers
            </h1>
            <h2 className={styles.h2}>
                Subscription is coming soon! Next version will release in:
            </h2>
            {isClient && (
                <h2 className={styles.h2}>
                    {`${timeLeft.days || 0} days ${formatTime(timeLeft.hours || 0)}:${formatTime(timeLeft.minutes || 0)}:${formatTime(timeLeft.seconds || 0)}`}
                </h2>
            )}
            <h2 className={styles.h2}>
                (Subscribe to your interested problem in one click)
            </h2>
            <header className={styles.header}>
                <input
                    className={styles.input}
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </header>
            <div className={styles.buttoncontainer}>
                <button
                    className={styles.button}
                    onClick={() => handleSearch(query)}
                >
                    Search
                </button>
                <button
                    className={styles.button}
                >
                    Subscribe
                </button>
            </div>
            {isClient && (
                <div className={styles.grid}>
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className={styles.card}
                        >
                            <h2 className={styles.title}>
                                <a href={result.url} target="_blank" rel="noopener noreferrer">
                                    {result.title}
                                </a>
                            </h2>
                            <p className={styles.author}>{result.author}</p>
                            <p className={styles.abstract}>{result.abstract}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
