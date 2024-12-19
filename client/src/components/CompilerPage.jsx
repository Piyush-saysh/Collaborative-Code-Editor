
import React from "react";

function CompilerPage({ compiling, compileResult, onClose }) {
    return (
        <div
            className="p-4 bg-gray-800 text-gray-100 border-l fixed top-0 right-0 h-full w-full md:w-1/3 shadow-lg"
            style={{ zIndex: 50 }} 
        >
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Compilation Output</h2>
                <button onClick={onClose} className="text-red-400">
                    Close
                </button>
            </div>
            <pre
                className="bg-gray-900 p-2 rounded overflow-auto text-sm"
                style={{ maxHeight: "80vh", whiteSpace: "pre-wrap" }}
            >
                {compiling ? "Compiling...\n" : ""}
                {compileResult || "No output available"}
            </pre>
        </div>
    );
}

export default CompilerPage;


