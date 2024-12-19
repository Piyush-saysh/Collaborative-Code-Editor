import React, { useEffect, useRef , useState} from 'react';
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

import "codemirror/lib/codemirror.css";
import CodeMirror from 'codemirror';

// import * as BabelParser from '@babel/parser';
// import * as esprima from 'esprima';
// import * as acorn from 'acorn';



function Editor({ socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);
    const [code, setCode] = useState('');  

    console.log(code);

    useEffect(() => {
        const init = async () => {
            const editor = CodeMirror.fromTextArea(
                document.getElementById("realTimeEditor"), {
                    mode: { name: "javascript", json: true },
                    theme: "dracula",
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            editorRef.current = editor;
            editor.setSize("100%", "100%");
            
                editorRef.current.on('change', (instance, changes) => {
                    if (!changes) return;
                    const { origin } = changes;
                    const codeContent = instance.getValue();
                    setCode(codeContent);  
                    onCodeChange(codeContent);

                    if (origin !== 'setValue') {
                        socketRef.current.emit('code-change', {
                            roomId,
                            code: codeContent
                        });
                    }
                });
            };
            init();
            }, []);



    


    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('code-change', ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }
        return () => {
            socketRef.current.off('code-change');
        };
    }, [socketRef.current]);


    return (
        <div style={{ height: "800px", width: "1100px" }}>
            <textarea
                id="realTimeEditor"
                className='flex-row items-start w-full h-full'
                style={{ textAlign: 'left' }} 
            ></textarea>
        </div>
    );
}

export default Editor;

