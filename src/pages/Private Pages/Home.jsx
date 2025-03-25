import {TypeAnimation} from "react-type-animation";
import {useEffect, useState} from "react";
import CountUp from "react-countup";


const Home = () => {
    const [day, setDay] = useState(0);
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(0);

    useEffect(() => {

        setDay(new Date().getDate());


        setMonth(new Date().getMonth() + 1);


        setYear(new Date().getFullYear());
    }, []);


    return (
        <main className={` min-h-[80vh]  transition-all duration-500 ease-in-out text-black dark:text-white `}>
            <div className="flex flex-col items-center justify-center h-full p-4">


                    <TypeAnimation
                        c
                        sequence={[

                            'Welcome to the World of Football',
                            1000,
                            'We produce food for Hamsters',
                            1000,
                            'We produce food for Guinea Pigs',
                            1000,
                            'We produce food for Chinchillas',
                            1000
                        ]}
                        wrapper="span"
                        speed={50}
                        style={{ fontSize: '50px', display: 'inline-block', fontWeight: 700}}
                        repeat={Infinity}
                    />

                <p className="text-xl mb-8 text-center max-w-2xl mx-auto leading-relaxed">
                    Immerse yourself in the exciting world of football. From thrilling matches to unforgettable goals, discover everything you need to know about your favorite sport. Stay updated with the latest news, stats, and matches happening around the globe.
                </p>

                <div className="mb-2">
                    <p className="text-lg text-center max-w-lg mx-auto mb-4">
                        Whether you&#39;re a passionate fan or just starting to explore football, our platform offers a wide variety of content to keep you engaged. Get closer to the action and experience the thrill of the game, wherever you are.
                    </p>
                </div>
                <div className='mb-8  text-2xl font-bold'>
                    <CountUp
                        start={0}
                        end={day}
                        duration={year / 350}
                    />
                    .
                    {month < 10 && '0'}
                    <CountUp
                        start={0}
                        end={month}
                        duration={year / 100}
                    />
                    .
                    <CountUp
                        start={0}
                        end={year}
                        decimals={0}
                        formattingFn={(value) => value.toLocaleString().replace(/,/g, '')}
                        duration={year / 350}
                    />
                </div>

            </div>
        </main>
    );
};

export default Home;