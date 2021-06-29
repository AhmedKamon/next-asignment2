import styles from '../../styles/Post.module.css'
import Image from 'next/dist/client/image';
import imageUrlBuilder from '@sanity/image-url';
import { useEffect, useState } from 'react';
import { Toolbar } from '../../Components/toolbar';

const BlockContent = require('@sanity/block-content-to-react');





const Post = ({ title, body, image }) => {
    const [imageUrl, setImageUrl] = useState('');
    console.log('image', imageUrl)

    useEffect(() => {
        const imgBuilder = imageUrlBuilder({
          projectId: '4swcn591',
          dataset: 'production',
        });
    
        setImageUrl(imgBuilder.image(image));
      }, [image]);

    return (
        <>
        <Toolbar/>
            <div className={styles.main}>
                <h1>{title}</h1>
            {/* <Image src={imageUrl} height={100} width={200} alt="Picture of the author" /> */}
            <div className={styles.body}>
                <BlockContent blocks={body}/>
            </div>
            </div>
        </>
    );
}

// export const getServerSideProps = async pageContext => {
//     const pageSlug = pageContext.query.slug;

//     if (!pageSlug) {
//         return {
//             notFound: true
//         }
//     }


//     const query = encodeURIComponent(`*[_type == post && slug.current == "${pageSlug}"]`);
export const getServerSideProps = async pageContext => {
    const pageSlug = pageContext.query.slug;

    if (!pageSlug) {
        return {
            notFound: true
        }
    }

    const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
    const url = `https://4swcn591.api.sanity.io/v2021-06-07/data/query/production?query=${query}`;

    const result = await fetch(url)
        .then(res => res.json())
    const post = result.result[0]

    if (!post) {
        return {
            notFound: true
        }
    } else {
        return {
            props: {
                title: post.title,
                body: post.body,
                image: post.mainImage,
            }
        }
    }

}



export default Post;