import { useState } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function MeetOurTeam() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const team = [
    {
      name: "Sahrul Ridho Firdaus",
      role: "Frontend Engineer",
      bio: "Passionate about creating products that make a difference in people's lives.",
      image: "images/placeholder-team-1.jpg",
      social: {
        Instagram: "https://instagram.com/sahrulfirdaus",
        linkedin: "https://linkedin.com/in/sahrulfirdaus/",
        github: "https://github.com/hiraeth12",
      },
    },
    {
      name: "Sam Rivera",
      role: "Backend Engineer",
      bio: "Bringing beautiful, functional designs to life with a focus on user experience.",
      image: "images/placeholder-team-2.jpg",
      social: {
        Instagram: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
    {
      name: "Taylor Chen",
      role: "UI/UX Designer",
      bio: "Building robust, scalable solutions with cutting-edge technologies.",
      image: "images/placeholder-team-3.jpg",
      social: {
        Instagram: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
  ];

  return (
    <section
      className="bg-[#E6E1D2]
 py-16 px-4 w-full max-w-7xl mx-auto "
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4 font-title text-slate-800">
          Meet Our Team
        </h2>
        <div className="w-14 h-0.5 bg-slate-800 mb-6 mx-auto" />
        <p className="text-muted-foreground max-w-2xl mx-auto font-body">
          The talented people behind our success, working together to bring our
          vision to life.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        {team.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card
              className="border-0 shadow-sm transition-all duration-300 hover:shadow-md"
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden aspect-square rounded-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredMember === index ? "scale-105" : "scale-100"
                    }`}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-1 font-semibold font-body">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 font-body">
                    {member.role}
                  </p>
                  <p className="text-sm mb-6 font-body">{member.bio}</p>
                  <div className="flex gap-4">
                    <a
                      href={member.social.Instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s Instagram`}
                    >
                      <Instagram className="h-5 w-5 text-muted-foreground hover:text-[#0077B5] transition-colors" />
                    </a>
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="h-5 w-5 text-muted-foreground hover:text-[#0077B5] transition-colors" />
                    </a>
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="h-5 w-5 text-muted-foreground hover:text-black transition-colors" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
