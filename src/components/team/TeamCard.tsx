"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export function TeamCard({ member, index }: TeamCardProps) {
  const isPlaceholder = member.name.includes("[");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full">
        <div className="aspect-[4/3] relative bg-muted">
          {isPlaceholder ? (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
              <User className="h-20 w-20 text-primary/30" />
            </div>
          ) : (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-xl text-foreground">
            {member.name}
          </h3>
          <p className="text-primary font-medium text-sm mt-1">
            {member.role}
          </p>
          <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
            {member.bio}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
