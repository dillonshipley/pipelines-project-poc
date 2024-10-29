import { ListGroup, Badge, Button } from "react-bootstrap";
import APICall from "../utils/APICall";

export default function SelectedEnvironmentData({name, environmentData}){
    const redVals = ["FAILED", "FAILURE", "BLOCKED"];

    async function redeployProject(jobId){
        let newPath = name.replaceAll('/', '%2F');
        let response = await APICall(`/redeployProject/${newPath}/${jobId}`);
    }

    return (
        <ListGroup>
            {environmentData.deployments.map((item) => {
                if(item == environmentData.deployments[0])
                    return;
                else {
                    return (
                        <ListGroup.Item className = "flex d-flex flex-direction-row" style = {{paddingLeft: "60px"}}>
                            {
                            new Date(item.createdDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })} at {
                            new Date(item.createdDate).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            })
                            }
                            <div style={{ 
                                color: item.status.toUpperCase() === 'SUCCESS' ? '#00b000' : 
                                    redVals.includes(item.status.toUpperCase()) ? 'red' : 'black' 
                            }}>
                                <b>- ({item.status != null && item.status.toUpperCase()})&nbsp;</b>
                            </div>                            
                            <div>created by {item.deployUser}</div>
                            {"commit" in item && <Badge bg = "dark" className = "flex d-flex justify-content-center align-items-center" style = {{marginLeft: "15px", marginRight: "15px"}}>{item.commit.substring(0, 8)}</Badge>}
                            <Button onClick = {() => redeployProject(item.realJobId)}>Redeploy</Button>
                        </ListGroup.Item>
                    )
                }

            })}
        </ListGroup>
    )
}