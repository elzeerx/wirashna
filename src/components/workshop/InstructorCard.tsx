
interface InstructorCardProps {
  name: string;
  bio: string;
  image?: string | null;
}

const InstructorCard = ({ name, bio, image }: InstructorCardProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">المدرب</h2>
      <div className="bg-wirashna-secondary p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {image && (
            <div className="flex-shrink-0">
              <img 
                src={image} 
                alt={name} 
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}
          <div className={image ? "" : "w-full"}>
            <h3 className="text-lg font-bold mb-2">{name}</h3>
            <p className="text-gray-700">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
