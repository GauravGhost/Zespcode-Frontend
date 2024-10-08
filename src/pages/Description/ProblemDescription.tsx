
import { useState, DragEvent, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import "../../imports/AceBuildImports";
import DOMPurify from 'dompurify';

import Languages from '../../constants/Languages';
import Themes from '../../constants/Themes';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import { CREATE_SUBMISSION, GET_PROBLEM_BY_TITLE_SLUG } from '../../api';
import { ProblemData } from '../../types/problem.types';
import { difficultyDesign } from '../../constants/dynamicDesign';
import { userSnippet } from '../../utils/utils';
import socketService, { SubmissionResponse } from '../../socket/socketClient';
import Loader from '../../components/Loader/Loader';
import ServerError from '../../components/ServerError/ServerError';
import ButtonLoader from '../../components/Loader/ButtonLoader';

type languageSupport = {
    languageName: string,
    value: string
}

type themeStyle = {
    themeName: string,
    value: string
}

function Description() {

    const [activeTab, setActiveTab] = useState('statement');
    const [testCaseTab, setTestCaseTab] = useState('input');
    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [language, setLanguage] = useState('cpp');
    const [code, setCode] = useState('');
    const [theme, setTheme] = useState('monokai');
    const [isSubmitResponse, setIsSubmitResponse] = useState(true);
    const [submissionResponse, setSubmissionResponse] = useState<SubmissionResponse>();
    const [isSubmissionResponse, setIsSubmissionResponse] = useState<boolean>(false);

    const { id } = useParams();
    const problemDetailResponse = useApi<ProblemData>(GET_PROBLEM_BY_TITLE_SLUG(id));
    const problemDetail = problemDetailResponse.data

    function submissionResponseToggle() {
        setIsSubmissionResponse(!isSubmissionResponse)
    }
    useEffect(() => {
        if (problemDetail) {
            setCode(userSnippet(problemDetail?.codeStubs, language));
        }
    }, [problemDetail, language]);

    if (problemDetailResponse.loading) {
        return <Loader />
    }
    if (problemDetailResponse.error) {
        return <ServerError />
    }

    const sanitizedMarkdown = DOMPurify.sanitize(problemDetail?.description ?? "");
    async function handleSubmission() {
        try {
            console.log(code)
            console.log(language)
            setIsSubmitResponse(false);
            socketService.setUserId("1");
            const response = await axios.post(CREATE_SUBMISSION(), {
                code,
                language,
                userId: "1",
                problemId: problemDetail?._id
            });
            const submissionPayload: SubmissionResponse = await socketService.getSubmissionPayload();
            setIsSubmitResponse(true);
            setIsSubmissionResponse(true);
            setSubmissionResponse(submissionPayload);
            setTestCaseTab('output');
            return response;
        } catch (error) {
            console.log(error);
            setIsSubmitResponse(true);
        }
    }

    const startDragging = (e: DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.preventDefault();
    }

    const stopDragging = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    }

    const onDrag = (e: DragEvent<HTMLDivElement>) => {
        if (!isDragging) return;

        const newLeftWidth = (e.clientX / window.innerWidth) * 100;
        if (newLeftWidth > 10 && newLeftWidth < 90) {
            setLeftWidth(newLeftWidth);
        }

    }

    const isActiveTab = (tabName: string) => {
        if (activeTab === tabName) {
            return 'tab tab-active';
        } else {
            return 'tab'
        }
    }

    const isInputTabActive = (tabName: string) => {
        if (testCaseTab === tabName) {
            return 'tab tab-active';
        } else {
            return 'tab';
        }
    }

    return (
        <div
            className='flex w-screen h-[calc(100vh-64px)]'
            onMouseMove={onDrag}
            onMouseUp={stopDragging}
        >

            <div className='leftPanel h-full overflow-auto' style={{ width: `${leftWidth}%` }}>

                <div role="tablist" className="tabs tabs-boxed w-3/5">
                    <a onClick={() => setActiveTab('statement')} role="tab" className={isActiveTab("statement")}>Problem Statement</a>
                    <a onClick={() => setActiveTab('editorial')} role="tab" className={isActiveTab("editorial")}>Editorial</a>
                    <a onClick={() => setActiveTab('submissions')} role="tab" className={isActiveTab("submissions")}>Submissions</a>
                </div>

                <div className='markdownViewer p-[20px] basis-1/2'>
                    <h2 className='my-3'>{problemDetail?.title}</h2>
                    <span className={`p-2 text-black text-xs rounded-badge bg-gray-800 ${difficultyDesign(problemDetail?.difficulty)}`} >{problemDetail?.difficulty}</span>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose my-2">
                        {sanitizedMarkdown}
                    </ReactMarkdown>
                </div>


            </div>

            <div className='divider cursor-col-resize w-[5px] bg-slate-200 h-full' onMouseDown={startDragging}></div>

            <div className='rightPanel h-full overflow-auto flex flex-col' style={{ width: `${100 - leftWidth}%` }}>

                <div className='flex gap-x-1.5 justify-start items-center px-4 py-2 basis-[5%]'>
                    <div>
                        <button className="btn btn-success btn-sm disabled:bg-opacity-100 disabled:opacity-100" disabled={!isSubmitResponse} onClick={handleSubmission}>{isSubmitResponse ? "Submit" : <ButtonLoader name='Submit' />}</button>
                    </div>
                    <div>
                        <button className="btn btn-warning btn-sm">Run Code</button>
                    </div>
                    <div>
                        <select
                            className="select select-info w-full select-sm max-w-xs"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >

                            {Languages.map((language: languageSupport) => (
                                <option key={language.value} value={language.value}> {language.languageName} </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            className="select select-info w-full select-sm max-w-xs"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            {Themes.map((theme: themeStyle) => (
                                <option key={theme.value} value={theme.value}> {theme.themeName} </option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="flex flex-col editor-console grow-[1] ">

                    <div className='editorContainer grow-[1]'>
                        <AceEditor
                            mode={language}
                            theme={theme}
                            value={code}
                            onChange={(e: string) => setCode(e)}
                            name='codeEditor'
                            className='editor'
                            style={{ width: '100%' }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                showLineNumbers: true,
                                fontSize: 16
                            }}
                            height='100%'
                        />
                    </div>

                    { /* Collapsable test case part */}

                    <div className="collapse bg-base-200 rounded-none">
                        <input type="checkbox" checked={isSubmissionResponse} onChange={submissionResponseToggle} className="peer" />
                        <div className="collapse-title bg-neutral-900 text-white-content peer-checked:bg-neutral-900 peer-checked:text-whitet">
                            Console
                        </div>
                        <div className="collapse-content bg-gray-900 text-primary-content peer-checked:bg-neutral-900 peer-checked:text-white">
                            <div role="tablist" className="tabs tabs-boxed w-2/5 my-2 ">
                                <a onClick={() => setTestCaseTab('input')} role="tab" className={isInputTabActive('input')}>Input</a>
                                <a onClick={() => setTestCaseTab('output')} role="tab" className={isInputTabActive('output')}>Output</a>
                            </div>

                            {
                                (testCaseTab === 'input')
                                    ? <textarea rows={4} cols={70} className='bg-neutral text-white rounded-md resize-none' />
                                    : <div className='h-30 w-full'>{
                                        isSubmissionResponse && <div>
                                            <h4 className=''>Output</h4>
                                            <p className={`my-1 ${submissionResponse?.response.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>{submissionResponse?.response.status}</p>
                                            <p className={`p-2 bg-black ${submissionResponse?.response.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>{submissionResponse?.response.output}</p>
                                        </div>
                                    }</div>
                            }
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Description;
