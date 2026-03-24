import { Quote, MapPin, ArrowRight } from "lucide-react"

const communityPosts = [
  {
    id: 1,
    content: "Spotted an Anna's Hummingbird in my backyard today! First one of the season.",
    author: "Sarah",
    location: "Portland, OR",
    date: "March 15",
  },
  {
    id: 2,
    content: "Three Ruby-throated hummingbirds showed up at my feeder this morning. They're finally here!",
    author: "Michael",
    location: "Austin, TX",
    date: "March 12",
  },
  {
    id: 3,
    content: "Just saw a Rufous Hummingbird fighting off a much larger bird. These tiny warriors are incredible.",
    author: "Jennifer",
    location: "Seattle, WA",
    date: "March 10",
  },
  {
    id: 4,
    content: "Put out fresh sugar water and within 30 minutes had my first visitor. So magical!",
    author: "David",
    location: "Denver, CO",
    date: "March 8",
  },
]

const totalSightings = 14230

export function CommunitySection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4 text-balance">
            From the Community
          </h2>
          <p className="text-[#5B6751] max-w-2xl mx-auto text-lg">
            Real sightings from hummingbird enthusiasts across North America
          </p>
        </div>

        {/* Community Posts Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {communityPosts.map((post) => (
            <div 
              key={post.id}
              className="relative pl-6 py-4"
            >
              {/* Left accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#A27F67] rounded-full" />
              
              {/* Quote icon */}
              <Quote className="h-5 w-5 text-[#E3D8C6] mb-3" />
              
              {/* Content */}
              <p className="text-[#4A4A4A] leading-relaxed mb-4" style={{ lineHeight: '1.8' }}>
                "{post.content}"
              </p>
              
              {/* Author info with location */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-[#2C2C2C]">— {post.author}</span>
                <span className="text-[#999999]">·</span>
                <span className="inline-flex items-center gap-1 text-[#5B6751]">
                  <MapPin className="h-3 w-3" />
                  {post.location}
                </span>
                <span className="text-[#999999]">·</span>
                <span className="text-[#999999]">{post.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Share Your Sighting Link */}
        <div className="text-center mb-8">
          <a 
            href="#subscribe"
            className="inline-flex items-center gap-2 text-[#5B6751] font-medium hover:underline transition-all"
          >
            Share Your Sighting
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Season Stats */}
        <div className="text-center">
          <p className="text-[#4A4A4A]">
            <span className="font-bold text-[#5B6751] text-lg">{totalSightings.toLocaleString()}</span>
            {" "}sightings reported this season
          </p>
        </div>
      </div>
    </section>
  )
}
