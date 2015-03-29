/*
 * 使用「位置服務」時，需基於「上次登陸地理位置」與「本次登陸地理位置」來測量「兩地距離」
 * 故當第一次登陸時，「上次登陸地理位置」從這裏隨即抽取一個
 *
 */

var place_list = [
    // Games
    {'name': '河洛客棧', 'lat': 25.9, 'lon': 22.9}, // 金庸群俠傳 - 河洛客棧(259, 229)
    // TV Shows
    {'name': 'Walt\'s House', 'lat': 35.126407, 'lon': 106.536532}, // Breaking Bad 絕命毒師
    {'name': 'Winterfell', 'lat': 56.185096, 'lon': -4.050264}, // Game of Thrones 權力的遊戲
    {'name': '思い出横丁', 'lat': 35.693267, 'lon': 139.699624}, // 深夜食堂
    {'name': 'St Bart\'s Hospital', 'lat': 51.518524, 'lon': -0.102420}, // Sherlock 神探夏洛克
    // Movies
    {'name': 'West 57th Street', 'lat': 40.767518, 'lon': -73.984131}, // Taxi Driver 出租車司機
    {'name': 'Timberline Lodge and Ski Area', 'lat': 45.331445, 'lon': -121.711246}, // The Shining 閃靈
    {'name': 'Agua Dulce Movie Ranch', 'lat': 34.524746, 'lon': -118.323962}, // The Man from Earth 這個男人來自地球
    {'name': 'Bassingbourn Barracks', 'lat': 52.094183, 'lon': -0.049989}, // Full Metal Jacket 全金屬外殼
    {'name': 'Høje Tåstrup Church', 'lat': 55.651642, 'lon': 12.260699}, // Jagten 狩獵
    {'name': 'Trinity Rd', 'lat': 51.452933, 'lon': -0.176744}, // A Clockwork Orange 發條橙
    {'name': 'Burger King', 'lat': 34.179248, 'lon': -118.319389}, // Back to the Future 回到未來
    {'name': 'The Firhill Complex', 'lat': 55.876989, 'lon': -4.268815}, // Trainspotting 猜火車
    {'name': 'Will\'s house', 'lat': 42.336215, 'lon': -71.051197}, // Good Will Hunting 心灵捕手
    {'name': 'Lars Homestead', 'lat': 33.842819, 'lon': 7.779033}, // Star War 星球大戰
    {'name': 'FBI Training Center', 'lat': 38.530526 , 'lon': -77.446548}, // The Silence of the Lambs 沉默的羔羊
    {'name': 'Office of NH Agent', 'lat': 38.918680777871536, 'lon': 139.8295721411705}, // おくりびと 入殮師
    {'name': 'Katniss\' House', 'lat': 35.696275, 'lon': -81.429208}, // The Hunger Games 飢餓遊戲
    {'name': 'Gattaca Corporation', 'lat': 38.002429, 'lon': -122.533404}, // Gattaca 千鈞一髮
    {'name': 'Philadelphia\'s City Hall', 'lat': 39.952441, 'lon': -75.164034}, // 12 Monkeys 十二猴子
    {'name': 'Cloth Fair Street', 'lat': 51.519120, 'lon': -0.099723}, // V for Vendetta V字仇殺隊
    {'name': 'Adam Street Bridge', 'lat': -33.879754, 'lon': 151.209109}, // The Matrix 黑客帝國
    {'name': 'Oregon State Mental Hospital', 'lat': 44.938761, 'lon': -123.004873}, // One Flew Over the Cuckoo's Nest 飛越瘋人院
    {'name': 'Piazza Umberto I', 'lat': 37.681525, 'lon': 13.379350}, // Cinema Paradiso 天堂電影院
    {'name': 'The Corleone Mansion', 'lat': 40.606463, 'lon': -74.098078}, // The Godfather 教父
    {'name': 'Krakow Glowny', 'lat': 50.067204, 'lon': 19.947372}, // Schindler's List 辛德勒名單
    {'name': 'Pat and Lorraine\'s', 'lat': 34.130739, 'lon': -118.216391}, // Reservoir Dogs 落水狗
    {'name': 'Hawthorne Grill', 'lat': 33.906667, 'lon': -118.352731}, // Pulp Fiction 低俗小說
    {'name': 'Grand Central Station', 'lat': 40.752754, 'lon': -73.977261}, // K-PAX K星異客
    {'name': 'The Winchester Tavern', 'lat': 51.478029, 'lon': -0.047706}, // Shaun of the Dead 殭屍肖恩
    {'name': 'Hendon Police Training College', 'lat': 51.593906, 'lon': -0.240091}, // Hot Fuzz 熱血警探
    {'name': '‘The First Post', 'lat': 51.785074, 'lon': -0.195785}, // The World's End 世界盡頭
    // 美国往事 死亡詩社
    // Documentaries
    {'name': 'すきやばし 次郎', 'lat': 35.672784, 'lon': 139.764048}, // 二郎は鮨の夢を見る
    // Others
    {'name': 'Steve\'s Job Garage', 'lat': 37.340538, 'lon': -122.068879} // Steve's Job Garage
]

module.exports = function (){

    var len    = place_list.length,
        random = ~~(Math.random() * len);
    
    return place_list[random]
}