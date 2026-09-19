import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";

const FlatDetailsHeader = ({ flatName, buildingName, city, buildingId }) => {
  const navigate = useNavigate();
  const { flatId: paramFlatId } = useParams();
  const flatId = paramFlatId || localStorage.getItem("currentFlatId");

  const handleBack = () => {
    const targetBuildingId = buildingId || localStorage.getItem("currentBuildingId");
    if (targetBuildingId) {
      navigate(`/buildings/${targetBuildingId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100"
          aria-label="Go back"
        >
          <FiArrowLeft />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-800">{flatName}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {buildingName} &bull; {city}
          </p>
        </div>
      </div>
{/* 
      <button
        type="button"
        onClick={() => navigate(`/flats/${flatId}/edit`)}
        className="inline-flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-500 transition hover:bg-blue-50"
      >
        <FiEdit2 className="text-sm" />
        Edit Details
      </button> */}
    </header>
  );
};

export default FlatDetailsHeader;
