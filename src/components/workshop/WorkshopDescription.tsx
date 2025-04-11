
interface WorkshopDescriptionProps {
  description: string;
}

const WorkshopDescription = ({ description }: WorkshopDescriptionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">وصف الورشة</h2>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

export default WorkshopDescription;
