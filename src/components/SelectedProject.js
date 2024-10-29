import {useState, useEffect} from 'react';
import { ListGroup, Image, Badge, Spinner } from 'react-bootstrap';
import APICall from '../utils/APICall';
import jsonData from '../jenkinsData.json'; 
import SelectedEnvironment from './SelectedEnvironment.js'

export default function SelectedProject({name, path}){

    let [environmentData, setEnvironmentData] = useState(null);
    let [selectedEnvironment, setSelectedEnvironment] = useState(null);
    let [selectedEnvironmentData, setSelectedEnvironmentData] = useState(null);

    let [loading, setLoading] = useState(false);

    let [source, setSource] = useState(null);

    async function loadProject(){
        setLoading(true);
        const diffJenkinsName = jsonData.find(item => item.repo === name);
        let project;
        if(diffJenkinsName != null)
            project = await APICall(`/project/${diffJenkinsName.jenkins}`)
        else{
            let newPath = path.replaceAll('/', '%2F');
            project = await APICall(`/project/${newPath}`)
        }

        console.log(project);

        setLoading(false);
        if(project.environments === "ERROR")
            return;
        else if(project.environments == "NOENVS")
            setEnvironmentData(project.environments)
        else{
            setEnvironmentData(project.environments)
            setSource(project.source);
        }
        
    }
    
    useEffect(() => {
        if(name != null)
            loadProject();
    }, [name]);

    useEffect(() => {
        if(environmentData != null){
            console.log(selectedEnvironment)
            let newEnvData = environmentData.find(item => item.name.toUpperCase() === selectedEnvironment);
            console.log(newEnvData);
            setSelectedEnvironmentData(newEnvData);
        }
    }, [selectedEnvironment])

    return (
        <div>
            {loading && 
                <div className = "flex d-flex align-items-center justify-content-center" style = {{width: "100%", marginTop: "20px"}}>
                    <Spinner animation="border" variant="primary"/>
                </div>
            }
            {(source != null) && (
                <ListGroup.Item className = "flex d-flex flex-direction-row pl-3">
                    <Image width = "25px" height = "10px" src={`${process.env.PUBLIC_URL}/info.png`} fluid/>
                    <div>
                    &nbsp; &nbsp;This application is deployed through <b>{source}</b>
                    </div>
                </ListGroup.Item>
            )}
            {(environmentData != null && Array.isArray(environmentData)) && environmentData.map((item, index) => (
                <div>
                    <ListGroup.Item key={index} className = "pl-3 flex d-flex flex-direction-row" 
                        style = {{textAlign: "left", paddingLeft: "30px", 
                        backgroundColor: item.deployments.length === 0 ? "#FF7276" : selectedEnvironment == item.name.toUpperCase() ? "#eeeeee" : "#ffffff"}}
                        onClick = {() => {if(selectedEnvironment == item.name.toUpperCase()) setSelectedEnvironment(null); else setSelectedEnvironment(item.name.toUpperCase())}}>
                        <div><b>{item.name.toUpperCase()}</b></div>
                        {item.deployments.length > 0 && (
                            <div className = "flex d-flex flex-drection-row">
                                <div> - last deployment&nbsp;</div>
                                <div style={{ 
                                    color: item.deployments[0].status.toUpperCase() === 'SUCCESS' ? '#00b000' : 
                                        item.deployments[0].status.toUpperCase() === ('FAILED' || 'FAILURE' || 'BLOCKED') ? 'red' : 'black' 
                                }}>
                                    <b>({item.deployments[0].status != null && item.deployments[0].status.toUpperCase()})&nbsp;</b>
                                </div>                            
                                <div>created by {item.deployments[0].deployUser} at {
                                new Date(item.deployments[0].createdDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} at {
                                new Date(item.deployments[0].createdDate).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true
                                })
                                }</div>
                                {"commit" in item.deployments[0] && <Badge bg = "dark" className = "flex d-flex justify-content-center align-items-center" style = {{marginLeft: "15px", marginRight: "15px"}}>{item.deployments[0].commit.substring(0, 8)}</Badge>}
                                {"jobId" in item.deployments[0] && <div>{item.deployments[0].jobId}</div>}
                                <Image width = "30px" height = "30px" className = "ml-auto mr-2" 
                                    src={`${process.env.PUBLIC_URL}/dropdown.png`} fluid/>
                            </div>
                        )}
                        {item.deployments.length === 0 && <div>- GitLab environment found, but this app is not deployed through GitLab</div>}
                    </ListGroup.Item>
                    {(selectedEnvironmentData != null && 
                        'deployments' in selectedEnvironmentData &&
                        selectedEnvironment == item.name.toUpperCase()) && <SelectedEnvironment name = {path} environmentData = {selectedEnvironmentData} />}
                </div>
            ))}
            {(environmentData != null && typeof environmentData == 'string') && 
                <div style = {{textAlign: 'left', paddingLeft: '20px'}} className = "ml-3">No Gitlab environments could be found for this project.</div>
            }   
            <br></br>
        </div>
    )
}