import { useState, useEffect } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

// Definisikan tipe untuk anggota tim agar lebih aman
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    Instagram: string;
    linkedin: string;
    github: string;
  };
}

export default function MeetOurTeam() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("data/team.json")
      .then((response) => response.json())
      .then((data) => setTeam(data))
      .catch((error) => console.error("Error fetching team data:", error));
  }, []);

  return (
    // === 1. SECTION disamakan dengan BlogSection (bg, py) ===
    <section className="bg-transparent py-16">
      {/* === 2. DIV KONTEN disamakan (max-w, mx, px) === */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-left mb-12">
          {/* === 3. JUDUL dan GARIS BAWAH disamakan (ml) === */}
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-cascadia md:ml-0 ml-0">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <div className="w-14 h-0.5 bg-[#3a4a3c] mb-5 md:ml-0 ml-0" />
        </div>

        {/* Grid Kartu Tim */}
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
                className="border-0 shadow-sm transition-all duration-300 hover:shadow-md bg-[#F8F7F2]"
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
                        <Instagram className="h-5 w-5 text-muted-foreground hover:text-[#E1306C] transition-colors" />
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
      </div>
    </section>
  );
}