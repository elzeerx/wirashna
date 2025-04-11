
interface InstructorCardProps {
  name: string;
  bio: string;
}

const InstructorCard = ({ name, bio }: InstructorCardProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">المدرب</h2>
      <div className="bg-wirashna-secondary p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        <p className="text-gray-700">{bio}</p>
      </div>
    </div>
  );
};

export default InstructorCard;
