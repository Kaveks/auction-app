"use client";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { blueGrey, grey, red, yellow } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import Link from 'next/link';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

// import ru from 'javascript-time-ago/locale/ru.json'
TimeAgo.addDefaultLocale(en)
// TimeAgo.addLocale(ru)

import ReactTimeAgo from "react-time-ago";
import { auctionType } from '@/types/collections';


interface AuctionItemProps {
  auction:auctionType|any;
  onDelete: () => void;
}
const AuctionItem = ({auction,onDelete }:AuctionItemProps) => {
 
  const deleteAuctionHandler = async () => {
    try {
      const response = await fetch(`/api/auction/${auction.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data);
      onDelete()
    } catch (error) {
      console.log(error);
    }
  
  };
  
 
  return (
    <div className="w-[270px] h-[450px] items-center">
    <Grid >
      <Grid item>

        <Card  sx={{ width: 270,height:450 , boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',}}}>
        <div className="w-[270px] h-[60px] items-center justify-between overflow-hidden">
        <CardHeader  sx={{
            color: yellow[700],
            fontSize: "36px", // Increase font size
            textAlign: "center", // Align text in the center
            fontWeight: "bold",
          }}
            avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                G.A
            </Avatar>
            }
            action={
              <Link href={`/auction/item/${auction.id}`} className='hover:bg-purple-500 rounded-full' >
              <IconButton aria-label="settings" >
              <ExpandMoreIcon />
              </IconButton>
            </Link>
          
                }
           
            title={`${auction.item_name}`}
          
        />
       </div>
    
        <div className='w-[250px] my-2 mx-3 h-[40px] items-center justify-center'>
          <div className='flex items-center justify-center w-full h-full rounded-full bg-slate-200 shadow-sm shadow-slate-200 px-5'>
          <ReactTimeAgo date={new Date(auction.created_at)} className='p-1 font-titleFont font-semibold'/>
          </div>
        </div>
       <div className="w-[270px] rounded-md bg-appBg my-2 h-[170px]">
      <Link href={`/auction/item/${auction.id}`}>

      {auction.item_image?.length > 0 && (
              <div className="overflow-hidden">
              {auction.item_image.map((itemImage:string) => (
              < CardMedia component="img" key={itemImage} className='overflow-hidden object-scale-down rounded-md px-2' 
                height="150"
                width='270'
                image={itemImage} 
                alt="item image"
                  
              />
              ))}
          </div>
          )}

        </Link>
        </div>

        <div className=" w-[270px] mt-5 h-[55px] ">
        <CardContent>
          <div className="w-[270px] h-[50px]">
            <Typography 
            variant="body1" 
            color="text.secondary"
            className=" text-slate-700 line-clamp-2 font-bodyFont leading-1 text-base font-bold"
                >
                  {auction.item_description}
            </Typography>
            </div>
        </CardContent>
        </div>

        <div className="my-2 mt-3 w-[268px] items-center justify-center h-3">
        <Divider />
        </div>

        <div className=" w-[270px] mt-2 h-[50px] ">
        <CardActions disableSpacing className='h-full'>
       
        <Link href={`/auction/item/${auction.id}`} className='hover:bg-purple-500 rounded-full' >
            <IconButton aria-label="settings" >
                <MoreVertIcon />
            </IconButton>
            </Link>

            <CardContent>
              <div className="flex gap-2 ml-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 rounded-full bg-textGreen h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
              </svg>

              <h3> {auction.auction_status} </h3>
              </div>
            </CardContent>

        </CardActions>
        </div>
        </Card>
     
  </Grid>
  </Grid>
  </div>
  );
};

export default AuctionItem;