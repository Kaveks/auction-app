
import Navbar from '@/components/navigation/navbar'
import AuctionList from '@/components/auctions/auctionList';
import Layout from '@/components/display/layout';

export default function Home() {
    return (
      <main className=' w-full flex flex-col overflow-x-hidden overflow-y-scroll 
      scrollbar  scrollbar-track-textDark/20 scrollbar-thumb-textDark/2-60'>
      <Navbar />
      <div className=''>
      <Layout hideSideNav={false}>
        <div className="">

          <AuctionList />
  
      
        </div>
      </Layout>
      </div>
      </main>
    )
  }
  