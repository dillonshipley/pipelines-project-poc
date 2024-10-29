import { ListGroup, Image, Container, Spinner } from 'react-bootstrap'
import {useState, useEffect} from 'react';
import SelectedProject from './SelectedProject.js';
import APICall from '../utils/APICall.js';

export default function Projects(){
    let [projects, setProjects] = useState(null);
    let [selected, setSelected] = useState(null);

    let [loading, setLoading] = useState(false);


    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            let projects = await APICall('/mdm-projects')
            const sortedItems = projects.projects.sort((a, b) => a.name_with_namespace.localeCompare(b.name_with_namespace));
            setLoading(false);
            setProjects(sortedItems);
        }
        
        loadAll();
    }, []);



    return (
        <Container>
            <ListGroup>
                {(projects == null && loading) && 
                    <div className = "flex d-flex align-items-center justify-content-center" style = {{width: "100%"}}>
                        <Spinner animation="border" variant="primary" style = {{marginTop: "30px"}}/>
                    </div>
                }
                {projects != null && projects.map((item) => (
                    <div key = {item.name}>
                        <ListGroup.Item
                            style={{
                                textAlign: 'left',
                                backgroundColor: selected === item.name ? '#dddddd' : 'transparent'
                            }}
                            onClick={() => {if(selected == item.name) setSelected(null); else setSelected(item.name)}}
                            className = "flex d-flex flex-direction"
                        >
                            <div style = {{flexGrow: 1}}>
                                {item.name_with_namespace}
                            </div>
                            <a href = {item.url}>
                                <Image height = "20px" style = {{marginLeft: "15px"}} src = {`${process.env.PUBLIC_URL}/gitlab.png`} />
                            </a>
                        </ListGroup.Item>
                        {selected === item.name && (
                            <SelectedProject name = {item.name} path = {item.path_with_namespace}/>
                        )}
                    </div>

                ))}
            </ListGroup>
        </Container>
    )
}