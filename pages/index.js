import Head from 'next/head'
import Image from 'next/image'
import styles from '@styles/Home.module.css'

import { useState, useEffect } from 'react'
import { getImages, getImagesByTag } from '../helper/api'

import {
    TextField,
    AppBar,
    Typography,
    Tabs,
    Tab,
    Chip,
    Button,
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'

import CardImage from '../components/CardImage/index'

export default function Home({ data }) {
    const [searchValue, setSearchValue] = useState('')
    const [searchValueTag, setSearchValueTag] = useState('')
    const [imageFromTagData, setImageFromTagData] = useState([])
    const [tab, setTab] = useState(0)
    const [page, setPage] = useState(0)

    const searchFilter = (searchValue, list) => {
        let lowerCaseQuery = searchValue.toLowerCase()
        let filteredList = searchValue
            ? list.filter((x) => x.tags.toLowerCase().includes(lowerCaseQuery))
            : list
        return filteredList
    }

    const handleSearchByTag = async (tag) => {
        let result = await getImagesByTag(tag)
        result = result.splice(0, 20) //only get 20 image
        // image https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
        let obj = result.map((item, index) => {
            return {
                title: item.title,
                media: {
                    m: `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
                },
                author: item.owner,
                tags: tag,
                description: 'From Tag Search',
            }
        })
        setImageFromTagData(obj)
    }

    const handleChangeTab = (event, newValue) => {
        setTab(newValue)
    }

    const handleChangePage = (event, page) => {
        setPage(page)
    }

    return (
        <div className={styles.container}>
            <AppBar position="static" className={styles.appbar}>
                <Tabs value={tab} onChange={handleChangeTab}>
                    <Tab label="Search" />
                    <Tab label="Pagination" />
                    <Tab label="Search tags by API request" />
                </Tabs>
            </AppBar>
            <main className={styles.main}>
                {tab === 0 && (
                    <div hidden={tab !== 0} className={styles.tab}>
                        <div className={styles.searchBar}>
                            <TextField
                                id="outlined-basic"
                                label="Search image by tags"
                                variant="outlined"
                                fullWidth
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            {!data && (
                                <Typography
                                    key="no"
                                    align="center"
                                    variant="h6"
                                >
                                    No Result
                                </Typography>
                            )}
                            {data &&
                                searchFilter(searchValue, data).map(
                                    (item, index) => {
                                        return (
                                            <div key={index}>
                                                <CardImage
                                                    key={'image' + index}
                                                    data={item}
                                                />
                                            </div>
                                        )
                                    }
                                )}
                        </div>
                    </div>
                )}
                {tab === 1 && (
                    <div hidden={tab !== 1} className={styles.tab}>
                        <div className={styles.searchcontainer}>
                            <div>
                                <CardImage key={page} data={data[page]} />
                            </div>
                            <div className={styles.pagination}>
                                <Pagination
                                    count={data.length}
                                    onChange={handleChangePage}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {tab === 2 && (
                    <div hidden={tab !== 2} className={styles.tab}>
                        <div hidden={tab !== 0} className={styles.tab}>
                            <div className={styles.searchBarTag}>
                                <TextField
                                    id="outlined-basic"
                                    label="Search image frm API by tags"
                                    variant="outlined"
                                    fullWidth
                                    value={searchValueTag}
                                    onChange={(e) =>
                                        setSearchValueTag(e.target.value)
                                    }
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                        handleSearchByTag(searchValueTag)
                                    }
                                >
                                    Search
                                </Button>
                            </div>
                            <div style={{ width: '100%' }}>
                                {imageFromTagData.length == 0 && (
                                    <Typography
                                        key="no"
                                        align="center"
                                        variant="h6"
                                    >
                                        No Result
                                    </Typography>
                                )}
                                {imageFromTagData &&
                                    imageFromTagData.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <CardImage
                                                    key={'imageTag' + index}
                                                    data={item}
                                                />
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
export async function getStaticProps(context) {
    const res = await getImages()
    const data = await res

    if (!res.status == 200) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data: data.items }, // will be passed to the page component as props
    }
}
