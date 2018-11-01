import csv

def weight(temp_category, score1):
    score1 = 0
    catgry = {'Pharmacy', 'Grocery', 'Restaurant', 'Fast Food', 'Gas Stations/Convenience Stores', 'Hospitals/Urgent Care'}
   
    if temp_category in catgry:
       score1 = 2
    else:
       score1 = 0

    return (score1)

def decision(score, rating):
    rating = ''
    if score > 39 :
       rating = 'high'
    elif score > 29 :
       rating = 'medium'  
    else:
       rating = 'low'

    return (rating)     


with open('result.csv', 'w', newline='') as f:
    thewriter = csv.writer(f)
    thewriter.writerow(['Zip', 'Score', 'Rating'])

    with open('output1.csv') as csvfile:
        reader = csv.DictReader(csvfile)

        rating = ""
        score1 = 0       
        temp_zip = 0 
        data_zip = 0
        temp_category = ""
        score = 0 


        for line in reader:
            if temp_zip  == line['Zip']: 
                temp_category = line['Category']
                #score = score + 1
                a = weight(temp_category, score1)
                score = score + a
                print(a) 
            else:
                a = weight(temp_category, score1)
                #score = score + 1
                score = score + a
                b = decision(score, rating)
                print('Zip', temp_zip)
                print('score', score)
                print('rating', b)
                if temp_zip != 0 :
                   thewriter.writerow([temp_zip, score, b])
                temp_zip = line['Zip']
                temp_category = line['Category']
                score = 0
                a = 0
                b = ''

    score = score + a
    b = decision(score, rating)
    print('Zip', temp_zip)
    print('Score', score)
    print('rating', b)
    thewriter.writerow([temp_zip, score, b])