import { Button, Image, Spacer } from "@nextui-org/react";
import React from "react";
import { asset } from "@/Utils/helpers";

const EmptySearchContent = ({ resetTable }) => {
    return (
        <div className="p-10">
            <div className="flex justify-center opacity-50">
                <Image
                    width={200}
                    alt="Empty search"
                    src={asset("empty_states/empty-search.png")}
                />
            </div>
            <Spacer y={5} />
            <h5 className="text-lg font-bold text-default-500">
                No results found.
            </h5>
            <p className="text-default-400 text-sm">
                We could not find any results matching your search criteria.
            </p>
            <p className="text-default-400 text-sm">
                Please try adjusting your search terms or check for any spelling
                errors.
            </p>
            <Spacer y={4} />
            <Button onClick={() => resetTable()}>Go back</Button>
        </div>
    );
};

export default EmptySearchContent;
