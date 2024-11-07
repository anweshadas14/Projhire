import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getMostPopularPodcast } from '../api/index';
import { getPodcastByCategory } from '../api';
import { PodcastCard } from '../components/PodcastCard.jsx'
import { getUsers } from '../api/index';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const DashboardMain = styled.div`
padding: 20px 30px;
padding-bottom: 200px;
height: 100%;
overflow-y: scroll;
display: flex;
flex-direction: column;
gap: 20px;
@media (max-width: 768px){
  padding: 6px 10px;
}
`;
const FilterContainer = styled.div`
display: flex;
flex-direction: column;
${({ box, theme }) => box && `
  background-color: ${theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`}
background-color: ${({ theme }) => theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @maedia (max-width: 768px){
    font-size: 18px;
  }
`;
const Span = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  @media (max-width: 768px){
    font-size: 14px;
  }
  color: ${({ theme }) => theme.primary};
  &:hover{
    transition: 0.2s ease-in-out;
  }
  `;
const Podcasts = styled.div`
display: flex;
flex-wrap: wrap;
gap: 14px;
padding: 18px 6px;
@media (max-width: 550px){
  justify-content: center;
}
`;

const Loader = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100%;
width: 100%;
`
// const DisplayNo = styled.div`
// display: flex;
// justify-content: center;
// align-items: center;
// height: 100%;
// width: 100%;
// color: ${({ theme }) => theme.text_primary};
// `

const Dashboard = ({ setSignInOpen }) => {
  const [mostPopular, setMostPopular] = useState([]);
  const [user, setUser] = useState();
  const [nlpProjects, setNlpProjects] = useState([]);
  const [frontendProjects, setFrontendProjects] = useState([]);
  const [backendProjects, setBackendProjects] = useState([]);
  const [androidProjects, setAndroidProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  //user
  const { currentUser } = useSelector(state => state.user);

  const token = localStorage.getItem("echowavetoken");
  const getUser = async () => {
    await getUsers(token).then((res) => {
      setUser(res.data)
    }).then((error) => {
      console.log(error)
    });
  }

  const getPopularPodcast = async () => {
    await getMostPopularPodcast()
      .then((res) => {
        setMostPopular(res.data)
        // console.log(res.data)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const getNLPProjects = async () => {
    getPodcastByCategory("nlp")
      .then((res) => {
        setNlpProjects(res.data)
        // console.log(res.data)
      })
      .catch((error) => console.log(error));
  }

  const getFrontendProjects = async () => {
    getPodcastByCategory("frontend")
      .then((res) => {
        setFrontendProjects(res.data)
        // console.log(res.data)
      })
      .catch((error) => console.log(error));
  }

  const getBackendProjects = async () => {
    getPodcastByCategory("backend")
      .then((res) => {
        setBackendProjects(res.data)
        // console.log(res.data)
      })
      .catch((error) => console.log(error));
  }

  const getAndroidProjects = async () => {
    getPodcastByCategory("android")
      .then((res) => {
        setAndroidProjects(res.data)
        // console.log(res.data)
      })
      .catch((error) => console.log(error));
  }

  const getallData = async () => {
    setLoading(true);
    if (currentUser) {
      setLoading(true);
      await getUser();
    }
    await getPopularPodcast();
    await getNLPProjects();
    await getFrontendProjects();
    // await getCommedyPodcasts();
    await getAndroidProjects();
    await getBackendProjects();
    setLoading(false);
  }

  useEffect(() => {
    getallData();
  }, [currentUser])

  return (
    <DashboardMain>
      {loading ?
        <Loader>
          <CircularProgress />
        </Loader>
        :
        <>
          {currentUser && user?.podcasts?.length > 0 &&
            <FilterContainer box={true}>
              <Topic>Your Uploads
                <Link to={`/profile`} style={{ textDecoration: "none" }}>
                  <Span>Show All</Span>
                </Link>
              </Topic>
              <Podcasts>
                {user?.podcasts.slice(0, 10).map((podcast) => (
                  <PodcastCard podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
                ))}
              </Podcasts>
            </FilterContainer>
          }
          <FilterContainer>
            <Topic>Most Popular
              <Link to={`/showpodcasts/mostpopular`} style={{ textDecoration: "none" }}>
                <Span>Show All</Span>
              </Link>
            </Topic>
            <Podcasts>
              {mostPopular.slice(0, 10).map((podcast) => (
                <PodcastCard podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Topic>NLP
              <Link to={`/showpodcasts/nlp`} style={{ textDecoration: "none" }}>
                <Span>Show All</Span>
              </Link>
            </Topic>
            <Podcasts>
              {nlpProjects.slice(0, 10).map((podcast) => (
                <PodcastCard podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Link to={`/showpodcasts/frontend`} style={{ textDecoration: "none" }}>
              <Topic>Frontend Development
                <Span>Show All</Span>
              </Topic>
            </Link>
            <Podcasts>
              {frontendProjects.slice(0, 10).map((podcast) => (
                <PodcastCard podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Link to={`/showpodcasts/backend`} style={{ textDecoration: "none" }}>
              <Topic>Backend Development
                <Span>Show All</Span>
              </Topic>
            </Link>
            <Podcasts>
              {backendProjects.slice(0, 10).map((podcast) => (
                <PodcastCard podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Link to={`/showpodcasts/android`} style={{ textDecoration: "none" }}>
              <Topic>Android Development
                <Span>Show All</Span>
              </Topic>
            </Link>
            <Podcasts>
              {androidProjects.slice(0, 10).map((podcast) => (
                <PodcastCard podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
        </>
      }
    </DashboardMain>
  )
}

export default Dashboard