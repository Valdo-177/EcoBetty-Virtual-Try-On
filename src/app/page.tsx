"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PredictionResponse {
  id: string;
  status: string;
  output: string[];
  error?: null;
}

function HomePage() {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [colectionImg, setColectionImg] = useState<
    { model: string; garment: string; result: string }[]
  >([]);
  const [result, setResult] = useState<PredictionResponse>({
    id: "",
    output: [
      "https://cdn.fashn.ai/b358440b-ae2a-44aa-92aa-0fbac2d172e6-u1/output_0.png",
    ],
    status: "processing",
    error: null,
  });
  const [statusId, setStatusId] = useState<string>("");
  const [previue, setPreviue] = useState(
    "https://cdn.fashn.ai/b358440b-ae2a-44aa-92aa-0fbac2d172e6-u1/output_0.png"
  );

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await convertToBase64(e.target.files[0]);
      setImage(base64);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const base64 = await convertToBase64(e.dataTransfer.files[0]);
      setImage(base64);
    }
  };

  const handleTryOn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/tryOn",
        {
          model_image: modelImage,
          garment_image: garmentImage,
          category: "tops", // Cambia según la categoría
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setStatusId(data.data.id);
      setLoadingScreen(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result.status === "processing") {
      setTimeout(() => {
        getPredictionStatus();
      }, 15000);
    }
  }, [statusId, result]);

  const getPredictionStatus = async () => {
    if (statusId === "") return;
    try {
      const response = await axios.get(`/api/tryOn/${statusId}`);
      const { data } = response.data;
      setResult(data);

      if (data.status !== "processing") {
        setPreviue(data.output[0]);
        setLoadingScreen(false);

        setColectionImg((prev) => [
          ...prev,
          { model: modelImage!, garment: garmentImage!, result: data.output[0] },
        ]);
      }
    } catch (error) {
      console.error("Error fetching prediction status:", error);
    }
  };

  return (
    <div className="bg-zinc-950 h-screen flex flex-col items-center justify-center relative">
      {loadingScreen && (
        <div className="flex items-center justify-center absolute w-full h-full bg-[#000000f2] backdrop-blur-sm text-white z-30">
          <LoadingSpinner />
        </div>
      )}

      {previue ===
        "https://cdn.fashn.ai/b358440b-ae2a-44aa-92aa-0fbac2d172e6-u1/output_0.png" ? (
        <form onSubmit={handleTryOn} className="bg-zinc-900 p-10 sm:w-[22rem] w-full">
          <h1 className="text-2xl font-bold text-slate-200 mb-5">Virtual Try-On</h1>

          <div
            className="p-4 border-dashed border-2 border-gray-500 rounded-md mb-4 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, setModelImage)}
            onClick={() => document.getElementById("modelImageInput")?.click()}
          >
            <p className="text-white text-center">
              {modelImage
                ? "Imagen del modelo cargada"
                : "Arrastre o seleccione la imagen del modelo"}
            </p>
            <input
              type="file"
              accept="image/*"
              id="modelImageInput"
              onChange={(e) => handleFileChange(e, setModelImage)}
              className="hidden"
            />
          </div>

          <div
            className="p-4 border-dashed border-2 border-gray-500 rounded-md mb-4 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, setGarmentImage)}
            onClick={() => document.getElementById("garmentImageInput")?.click()}
          >
            <p className="text-white text-center">
              {garmentImage
                ? "Imagen de prenda cargada"
                : "Arrastre o seleccione la imagen de la prenda"}
            </p>
            <input
              type="file"
              accept="image/*"
              id="garmentImageInput"
              onChange={(e) => handleFileChange(e, setGarmentImage)}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 w-[max-content] flex items-center p-2 rounded-md gap-3 mt-2 disabled:opacity-50 text-white"
            disabled={loading || !modelImage || !garmentImage}
          >
            {loading ? <><LoadingSpinner /> Processing...</> : "Submit"}
          </button>
        </form>
      ) : (
        <div className="flex items-center flex-col gap-10 sm:flex-row">
          <Image
            src={previue}
            alt="Resultado"
            width={800}
            height={800}
            className="w-[20rem]"
          />
            {colectionImg.map((img, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Image src={img.model} alt="Modelo" width={150} height={150} />
                <Image src={img.garment} alt="Prenda" width={150} height={150} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;



// "use client";

// import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
// import axios from "axios";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// interface PredictionResponse {
//   id: string;
//   status: string;
//   output: string[];
//   error?: null;
// }


// function HomePage() {
//   const [modelImage, setModelImage] = useState<string | null>(null);
//   const [garmentImage, setGarmentImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingScreen, setLoadingScreen] = useState(false);
//   const [colectionImg, setColectionImg] = useState([])
//   const [result, setResult] = useState<PredictionResponse>({
//     id: '',
//     output: [
//       "https://cdn.fashn.ai/b358440b-ae2a-44aa-92aa-0fbac2d172e6-u1/output_0.png"
//     ],
//     status: "processing",
//     error: null
//   });
//   const [statusId, setStatusId] = useState<string>("");
//   const [previue, setPreviue] = useState("https://cdn.fashn.ai/b358440b-ae2a-44aa-92aa-0fbac2d172e6-u1/output_0.png")

//   const convertToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (err) => reject(err);
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleFileChange = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//     setImage: React.Dispatch<React.SetStateAction<string | null>>
//   ) => {
//     if (e.target.files && e.target.files[0]) {
//       const base64 = await convertToBase64(e.target.files[0]);
//       setImage(base64);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const handleDrop = async (
//     e: React.DragEvent<HTMLDivElement>,
//     setImage: React.Dispatch<React.SetStateAction<string | null>>
//   ) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const base64 = await convertToBase64(e.dataTransfer.files[0]);
//       setImage(base64);
//     }
//   };

//   const handleTryOn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { data } = await axios.post("/api/tryOn", {
//         model_image: modelImage,
//         garment_image: garmentImage,
//         category: "tops", // Cambia según la categoría
//       }, {
//         headers: {
//           "Content-Type": "application/json", // Este encabezado es opcional, axios lo maneja automáticamente para JSON
//         },
//       });

//       console.log(data.data);
//       setStatusId(data.data.id)
//       console.log(data.data.id)
//       setLoadingScreen(true)
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (result.status == "processing") {
//       setTimeout(() => {
//         getPredictionStatus()
//       }, 15000);
//       console.log('Aun en cola')
//     } else {
//       console.log('ya devio aparecer')
//     }
//   }, [statusId, previue, result])


//   const getPredictionStatus = async () => {
//     console.log(statusId)
//     if (statusId == '') return
//     try {
//       const response = await axios.get(`/api/tryOn/${statusId}`);

//       const { data } = response.data
//       console.log('Prediction Status:', data);
//       setResult(data)
//       if (data.status == "processing") {
//         console.log('Aun falta')
//       } else {
//         setPreviue(data.output[0])
//         setLoadingScreen(false)
//       }
//       console.log(data.status)
//     } catch (error) {
//       console.error('Error fetching prediction status:', error);
//     }
//   };


//   return (
//     <div className="bg-zinc-950 h-screen flex justify-center items-center relative">


//       {/* <button
//         onClick={() => getPredictionStatus()}
//         className={`${statusId == '' ? 'bg-red-500' : 'bg-green-500'} p-2 rounded-md block mt-2 disabled:opacity-50 text-white`}
//         disabled={statusId == ''}
//       >
//         {statusId == '' ? "Aun no tenemos Id " : "Get status "} {statusId}
//       </button> */}
//       {loadingScreen && <div className="flex items-center justify-center absolute w-full h-full bg-[#000000f2] backdrop-blur-sm text-white z-30">
//         <LoadingSpinner />
//       </div>}

//       {previue == "https://cdn.fashn.ai/b358440b-ae2a-44aa-92aa-0fbac2d172e6-u1/output_0.png" ?
//         <form onSubmit={handleTryOn} className="bg-zinc-900 p-10 sm:w-[23rem] w-full">
//           <h1 className="text-2xl font-bold text-slate-200 mb-5">EcoBetty | Virtual Try-On</h1>

//           {/* Model Image Drop Area */}
//           <div
//             className="p-4 border-dashed border-2 border-gray-500 rounded-md mb-4 cursor-pointer"
//             onDragOver={handleDragOver}
//             onDrop={(e) => handleDrop(e, setModelImage)}
//             onClick={() => document.getElementById("modelImageInput")?.click()}
//           >
//             <p className="text-white text-center">
//               {modelImage ? "Imagen del modelo cargada" : "Arrastre o seleccione la imagen del modelo"}
//             </p>
//             <input
//               type="file"
//               accept="image/*"
//               id="modelImageInput"
//               onChange={(e) => handleFileChange(e, setModelImage)}
//               className="hidden"
//             />
//           </div>

//           {/* Garment Image Drop Area */}
//           <div
//             className="p-4 border-dashed border-2 border-gray-500 rounded-md mb-4 cursor-pointer"
//             onDragOver={handleDragOver}
//             onDrop={(e) => handleDrop(e, setGarmentImage)}
//             onClick={() => document.getElementById("garmentImageInput")?.click()}
//           >
//             <p className="text-white text-center">
//               {garmentImage
//                 ? "Imagen de prenda cargada"
//                 : "Arrastre o seleccione la imagen de la prenda"}
//             </p>
//             <input
//               type="file"
//               accept="image/*"
//               id="garmentImageInput"
//               onChange={(e) => handleFileChange(e, setGarmentImage)}
//               className="hidden"
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="bg-green-500 w-[max-content] flex items-center p-2 rounded-md gap-3 mt-2 disabled:opacity-50 text-white"
//             disabled={loading || !modelImage || !garmentImage}
//           >
//             {loading ? <><LoadingSpinner /> Processing...</> : "Submit"}
//           </button>
//         </form>
//         :
//         <Image
//           src={previue}
//           alt=""
//           width={800}
//           height={800}
//           className="w-[20rem]"
//         />
//       }
//     </div>
//   );
// }

// export default HomePage;
