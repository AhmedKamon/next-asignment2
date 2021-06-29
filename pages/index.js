import Head from 'next/head'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url';
import styles from '../styles/Home.module.css'
import { Toolbar } from '../Components/toolbar'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const BlockContent = require('@sanity/block-content-to-react');
import { Container, Grid, Typography, Button } from "@material-ui/core";

export default function Home({ posts }) {
  const router = useRouter();
  console.log(posts)
  const [mappedPosts, setMappedPosts] = useState([]);

  useEffect(() => {
    if (posts.length) {
      const imgBuilder = imageUrlBuilder({
        projectId: '4swcn591',
        dataset: 'production',
      });

      setMappedPosts(
        posts.map(p => {
          return {
            ...p,
            mainImage: imgBuilder.image(p.mainImage).width(500).height(250),
          }
        })
      );
    } else {
      setMappedPosts([]);
    }
  }, [posts]);
  return (
    <div >
      <Toolbar />

      <div >
        <Grid container direction="row" justify='center' alignItems='center'  >
          <Grid item xs={6} md={4} align='center' className={styles.main} >
            {mappedPosts.length ? mappedPosts.map((p, index) => (
              <div className={styles.mainBody} onClick={() => router.push(`/post/${p.slug.current}`)} key={index} >
                <h3 className={styles.mainTitle}>{p.title}</h3>
                <BlockContent blocks={p.body} />
                <Button variant="contained" color="secondary" className={styles.mainBody} onClick={() => router.push(`/post/${p.slug.current}`)}>Learn More</Button>
              </div>
            )) : <>No Posts Yet</>}
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export const getServerSideProps = async pageContext => {
  const query = encodeURIComponent('*[ _type == "post" ]');
  const url = `https://4swcn591.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then(res => res.json());
  if (!result.result || !result.result.length) {
    return {
      props: {
        posts: [],
      }
    }
  } else {
    return {
      props: {
        posts: result.result,
      }
    }
  }
};