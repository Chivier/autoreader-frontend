'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import styles from './search.module.css';

type TimeLeft = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
};

export function Search() {
    const { user } = useUser();
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<any[]>([]);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({});
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setTimeLeft(calculateTimeLeft());
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, []);

    const handleSearch = async (searchQuery: string) => {
        setIsSearching(true);
        const level = "general"; // Set the level here
        const response = await fetch('https://autoreader-backend.ed-aisys.com/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: searchQuery, level: level }),
        });
        var data = await response.json();
        var papers = data.papers;
        for (var i = 0; i < papers.length; i++) {
            papers[i].pdfurl = papers[i].url.replace("abs", "pdf");
            const paper_id = papers[i].url.split("/").pop();
            papers[i].unrelatedlink = `https://autoreader-backend.ed-aisys.com/api/unrelated?query=${searchQuery}&paperid=${paper_id}`;
        }
        setResults(data.papers); // Based on your comment, the results are in the "papers" field
        setIsSearching(false);
    };

    const handleSubscribe = async (searchQuery: string) => {
        if (!user) {
            alert('Please sign in to subscribe');
            return;
        }
        const email = user.primaryEmailAddress?.emailAddress;
        console.log("email", user.primaryEmailAddress?.emailAddress);
        console.log(email);
        const response = await fetch('https://autoreader-backend.ed-aisys.com/api/subscribe/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_email: email, query: searchQuery }),
        });
        console.log(email);
        console.log(searchQuery);
    }

    const uploadUnrelatedInfo = async (unrelatedlink: string) => {
        // setIsSearching(true);
        const response = await fetch(unrelatedlink, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // var data = await response.json();
        // setIsSearching(false);
    }

    // function calculateTimeLeft(): TimeLeft {
    //     const deadline = new Date('June 09, 2024 23:00:00');
    //     const now = new Date();
    //     const difference: number = deadline.getTime() - now.getTime();

    //     let timeLeft: TimeLeft = {};

    //     if (difference > 0) {
    //         timeLeft = {
    //             days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    //             hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    //             minutes: Math.floor((difference / 1000 / 60) % 60),
    //             seconds: Math.floor((difference / 1000) % 60),
    //         };
    //     }

    //     return timeLeft;
    // }
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch(query);
        }
    };

    const formatTime = (time: number) => {
        return time < 10 ? `0${time}` : time;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>
                Semantic Search in today&apos;s arXiv Papers
            </h1>
            {/* <h2 className={styles.h2}>
                Subscription is coming soon! Next version will release in:
            </h2>
            <h2 className={styles.h2}>
                {`${timeLeft.days || 0} days ${formatTime(timeLeft.hours || 0)}:${formatTime(timeLeft.minutes || 0)}:${formatTime(timeLeft.seconds || 0)}`}
            </h2>
            <h2 className={styles.h2}>
                (Subscribe to your interested problem in one click)
            </h2> */}
            <header className={styles.header}>
                <input
                    className={styles.input}
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
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
                    onClick={() => handleSubscribe(query)}
                >
                    Subscribe
                </button>
            </div>
            {isSearching ? (
                <div className={styles.spinner}>
                    {/* Add your spinner or loading animation here */}
                    <div className={styles.loader}></div>
                </div>
            ) : (
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
                            <div className={styles.buttonGroup}>
                                <button className={styles.thumbButton} onClick={() => uploadUnrelatedInfo(result.unrelatedlink)}>Unrelated</button>
                                <a href={result.pdfurl} className={styles.readPdfButton} target="_blank" rel="noopener noreferrer">Read PDF</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
