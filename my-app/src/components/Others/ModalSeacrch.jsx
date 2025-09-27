import { use, useEffect, useState } from "react";
import axios from "axios";
import Image from './Image'
import { Link } from "react-router-dom";
import Loading from "../Layout/Loading";




const ModalSearch = ({ searchTerm }) => {

    const [movie, setMovie] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(searchTerm === "");

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`https://phimapi.com/v1/api/tim-kiem?keyword=${searchTerm}&limit=5`);
                setMovie(res.data.data.items);
            } catch (error) {
              
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(() => {
            getData();

        }, 500); // 500ms

        return () => clearTimeout(timer)


    }, [searchTerm]);


    if (searchTerm.trim() === "" || !open)
        return null;



    return (<div className="absolute top-[calc(100%+5px)] left-0 right-0 z-50 min-w-[360px] bg-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4">
            <h4 className="text-sm text-gray-400 mb-3 "> Danh sách phim </h4>
            {loading ? (<Loading />) : (
                <div className="flex flex-col gap-4 ">
                    {
                        movie?.map((item, index) => (
                            <Link key={index} to={`/phim/${item.slug}`}>
                                <div onClick={() => setOpen(false)} className=" flex gap-4">

                                    <div className=" w-[50px] relative flex-shrink-0">
                                        <Image
                                            rounded="md"
                                            src={`https://img.phimapi.com/${item.poster_url}`}

                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="" >{item.name}</h4>
                                        <p className="text-sm truncate">{item.origin_name}</p>
                                        <div className="gap-2 flex text-xs items-center mt-2">
                                            <span>{item.time}</span>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                                            <span>{item.episode_current}</span>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                                            <span>{item.quality}</span>
                                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                                            <span>{item.year}</span>
                                        </div>
                                    </div>

                                </div>
                            </Link>

                        ))
                    }
                </div>
            )}
        </div>
    </div>);

}

export default ModalSearch;