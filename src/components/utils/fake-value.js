function randomPeopleImages(){
    return Array(13).fill("afa").reduce((agg, entry, index) => {
        return [...agg, `people/male/${index+1}.jpg`, `people/female/${index+1}.jpg`];
    }, []).sort(_ => Math.random() - 0.5);
}

function fakeValue(type = "Text", count = 1) {
    try {
        const faker = require("../data/faker");

        const customFaker = {
            text(){
                const value = faker.lorem.words(3);
                return value;
            },
            time(){
                const hour = Math.floor(Math.random() * 12) + 1;
                const minute = Math.floor(Math.random()*60);
                let amPm = Math.round(Math.random()) ? 1 : -1;
                amPm = amPm > 0 ? "am" : "pm";
                
                return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${amPm}`
            },
            money(){
                const currency = faker.finance.currencySymbol();
                const amount = faker.finance.amount(); 
                
                return `${currency} ${amount.toLocaleString()}`;
            },
            phoneNumber(){
                return faker.phone.phoneNumberFormat(2);
            },
            rating(){
                const value = (Math.random() * 5) + 1;
                return value;
            },
            number(){
                const value = faker.datatype.number();
                return value.toLocaleString();
            },
            trend(){
                const value = Math.floor(Math.random()*20) + 60;
                const direction = Math.round(Math.random()) ? 1 : -1;
                const sign = direction != -1 ? '+' : '';
                return `${sign}${value * direction}`;
            },
            image(){
                const index = Math.floor(Math.random() * 13) + 1;
                return `random/${index}.jpg`;
            },
            person(){
                const image = randomPeopleImages();
                return image[0];
            },
            people(){
                const count = Math.floor(Math.random() * 3) + 2;
                return randomPeopleImages().slice(0, Math.min(count, 3)).join(',');
            }
        };
    
        var typeMap = {
            'Text': customFaker.text, 
            "Name": faker.name.findName,
            'Email': faker.internet.email, 
            'Date': faker.date.recent, 
            'Time': customFaker.time, 
            'Number': customFaker.number,
            'Phone Number': customFaker.phoneNumber, 
            'Money': customFaker.money,
            'Color': faker.internet.color,
            'Username': faker.internet.userName,
            'Company': faker.company.companyName,
            'Status': faker.random.boolean,
            'Rating': customFaker.rating,
            'Trend': customFaker.trend,
            'Image': customFaker.image, 
            'Person': customFaker.person,
            'People': customFaker.people,
        };

        const value = typeMap[type]();
        return value.toString();
        // if(count == 1)
        //     return typeMap[type]();
    } catch (error) {
        console.log("Error getting random value: ", error);
    }
}

export default fakeValue;