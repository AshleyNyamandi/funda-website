import supabase from "../utils/supabase";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router";


export interface Subject {
  id: number;
  name: string;

}

const fetchSubjects = async (): Promise<Subject[]> => {
  const { data, error } = await supabase
                                .from("subjects")
                                .select("id, name")
                                .order("name", {ascending: true});
  if (error) {
    throw new Error(error.message);
  }

  
  return (data ?? []) as Subject[];
};

const Subjects: React.FC = () => {
  
  const { data, isError, isLoading } = useQuery<Subject[], Error>({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  if (isError) {
    return <h1>Error loading subjects</h1>;
  }

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
<section className="max-w-2xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
  <div 
    className="
      grid 
      grid-cols-1 
      md:grid-cols-2 
      gap-6 
      sm:gap-8 
      lg:gap-10
    "
  >
    {(data ?? []).map((subject) => (
      <Link to={`subject/${subject.name}`}
        key={String(subject.id)}
        className="
          group
          relative 
          overflow-hidden 
          rounded-2xl 
          bg-linear-to-br from-[#D9EEE1] via-white to-[#E8F5E9]
          shadow-lg 
          hover:shadow-2xl 
          transition-all 
          duration-500 
          hover:-translate-y-2
          border border-green-100
        "
      >
        {/* Decorative accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-400 to-teal-500" />
        
        <div className="p-6 sm:p-8 lg:p-10">

          {/* Subject Title */}
          <h2 
            className="
              text-xl font-semibold 
              text-gray-800 
              leading-tight
              group-hover:text-emerald-700 
              transition-colors
              capitalize
            "
          >
            {subject.name}
          </h2>

        </div>
      </Link>
    ))}
  </div>
</section>
  );
};

export default Subjects;