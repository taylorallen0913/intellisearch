# Intellisearch

![Home Page](https://github.com/taylorallen0913/expedition-hacks-project/blob/master/assets/thumbnail1.jpg)
![Upload Page](https://github.com/taylorallen0913/expedition-hacks-project/blob/master/assets/thumbnail2.jpg)

This is Taylor Allen and Kai Breese's project submission in the [Expedition Hacks](https://expeditionhacks.com/combating-human-trafficking-2020/) 2020 hackathon. Our team won the best student project prize.

![Award](https://expeditionhacks.com/wp-content/uploads/2020/03/Students-02-1536x1186.png)

Intellisearch is a novel search engine that lets users search through videos for specific faces. This technology will allow law enforcement to locate missing and kidnapped persons much quicker if they have access to large databases of video. Our software uses an advanced facial recognition algorithm to compare the face of a missing person against faces in gathered videos. By being able to see the last known location of a person, it will aid authorities in locating them faster than ever. AI is the our future and may be one of our best weapons against human trafficking.

We use facial recognition technologies to aid law enforcement in identifying participants or victims subject of human trafficking. Law enforcement can input images and scan a large dataset of videos and easily detect if the indivisual pictured in the image appears in the dataset. 

## Getting Started

### Prerequisites
 - [Node](https://nodejs.org/en/)

#### Clone the repository and navigate to the directory
```
git clone https://github.com/taylorallen0913/expedition-hacks-project

cd expedition-hacks-project
```

#### Install all npm modules
```
npm install && cd client && npm install && cd ..
```

#### Add .env file with your AWS config into the root directory
```
AWS_ID=
AWS_SECRET=
AWS_REGION=
AWS_BUCKET_NAME=
```

#### Run the development server
```
npm run dev
```

#### You can now navigate to the webpage at http://localhost:3000
