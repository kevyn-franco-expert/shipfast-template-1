import Image, {StaticImageData} from "next/image";
import config from "@/config";

// The list of your testimonials. It needs 3 items to fill the row.
const list: {
    username?: string;
    name: string;
    text: string;
    img?: string | StaticImageData;
}[] = [
    {
        // Optional, use for social media like Twitter. Does not link anywhere but cool to display
        username: "jobhunter_user1",
        name: "Anna Smith",
        text: "JobHunter helped me land my dream job in just weeks! The tailored CV features saved me so much time and helped me stand out to recruiters.",
        // Optional, a statically imported image (usually from your public folder—recommended) or a link to the person's avatar. Shows a fallback letter if not provided
        img: "https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg",
    },
    {
        username: "tech_enthusiast",
        name: "John Doe",
        text: "I was overwhelmed with the job search process, but JobHunter simplified everything. I received targeted job listings that matched my skills perfectly.",

    },
    {
        username: "dev_guru",
        name: "Sarah Lee",
        text: "JobHunter streamlined my job search. The easy-to-use interface and quick CV customization helped me apply to top jobs in no time.",
    },
];

// A single testimonial, to be rendered in  a list
const Testimonial = ({i}: { i: number }) => {
    const testimonial = list[i];

    if (!testimonial) return null;

    return (
        <li key={i}>
            <figure
                className="relative max-w-lg h-full p-6 md:p-10 bg-base-200 rounded-2xl max-md:text-sm flex flex-col">
                <blockquote className="relative flex-1">
                    <p className="text-base-content/80 leading-relaxed">
                        {testimonial.text}
                    </p>
                </blockquote>
                <figcaption
                    className="relative flex items-center justify-start gap-4 pt-4 mt-4 md:gap-8 md:pt-8 md:mt-8 border-t border-base-content/5">
                    <div className="w-full flex items-center justify-between gap-2">
                        <div>
                            <div className="font-medium text-base-content md:mb-0.5">
                                {testimonial.name}
                            </div>
                            {testimonial.username && (
                                <div className="mt-0.5 text-sm text-base-content/80">
                                    @{testimonial.username}
                                </div>
                            )}
                        </div>

                        <div className="overflow-hidden rounded-full bg-base-300 shrink-0">
                            {testimonial.img ? (
                                <Image
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                                    src={list[i].img}
                                    alt={`${list[i].name}'s testimonial for ${config.appName}`}
                                    width={48}
                                    height={48}
                                />
                            ) : (
                                <span
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex justify-center items-center text-lg font-medium bg-base-300">
                  {testimonial.name.charAt(0)}
                </span>
                            )}
                        </div>
                    </div>
                </figcaption>
            </figure>
        </li>
    );
};

const Testimonials3 = () => {
    return (
        <section id="testimonials">
            <div className="py-24 px-8 max-w-7xl mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <div className="mb-8">
                        <h2 className="sm:text-5xl text-4xl font-extrabold text-base-content">
                            212 job seekers have found their dream jobs with JobHunter!
                        </h2>
                    </div>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-base-content/80">
                        Don't just take our word for it. Here's what users have to say about JobHunter.

                    </p>
                </div>

                <ul
                    role="list"
                    className="flex flex-col items-center lg:flex-row lg:items-stretch gap-6 lg:gap-8"
                >
                    {[...Array(3)].map((e, i) => (
                        <Testimonial key={i} i={i}/>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Testimonials3;
