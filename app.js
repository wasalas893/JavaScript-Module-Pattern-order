// storage controller


//item controller
const ItemCtrl=(function(){
   
    //Item constructor
    const Item=function(id,name,calories){
        this.id=id;
        this.name=name;
        this.calories=calories;
    }

    //Date Strutrue /State
    const data= {
        items:[
           // {id: 0,name:'Steak Dinner',calories:100},
           // {id: 1,name:'chican',calories:200}
        ],
        currentItem:null,
        totalCalories: 0
    }
    //public methods
    return {
      getItems:function(){
         return data.items;
      },
      addItem:function(name,calories){
         let ID; 
       //create id
       if(data.items.length>0){
           ID=data.items[data.items.length - 1].id+1;

       }else{
           ID=0;
       }
       //calories to number
       calories=parseInt(calories);

       //careate new item

       newItem=new Item(ID,name,calories);

       //add to items array
       
       data.items.push(newItem);

       return newItem;


      },
      getItemById: function(id){
          let found=null;

          //loop through items

          data.items.forEach(function(item){
              if(item.id==id){
                  found=item;

              }


          });

          return found;
      },
      setCurrentItem:function(item){
          data.currentItem=item;

      },
      getCurrentItem:function(){
          return data.currentItem;
      },

      getTotalCalories:function(){
          let total=0;
         //loop through items and cals
          data.items.forEach(function(item){
           
              total=total+item.calories;
          });
          //set total cal in adata struture
          data.totalCalories=total;

          //return totala
          return data.totalCalories;
      },

        logData:function(){
            return data;
        } 
    }

})();
// UI controller
const UICtrl=(function(){
    const UISelectors={
        itemList:'#item-list',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-Calories',
        totalCalories:'.total-calories'
    }
    //public methods

    return {
        populateItemList:function(items){
            let html='';

            items.forEach(function(item){
                html+=`  <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong>
                <em>${item.calories}</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i></a>
            </li>`;
            });
            //insert list items
        document.querySelector(UISelectors.itemList).innerHTML=html;    
        },
        getItemInput:function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }

        },

        addListItem:function(item){
            //show the list
           document.querySelector(UISelectors.itemList).style.display='block'; 
            //create li element
            const li=document.createElement('li');
            //add class
            li.className='collection-item';

            //add Id
            li.id=`item-${item.id}`;
            //add html
            li.innerHTML=` <strong>${item.name}:</strong>
            <em>${item.calories}</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i></a>`;

            //insert item

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li)









        },
        clearInput:function(){

        document.querySelector(UISelectors.itemNameInput).value='';
        document.querySelector(UISelectors.itemCaloriesInput).value='';





        },
        addItemToForm:function(){

            document.querySelector(UISelectors.itemNameInput).value=
            ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value=
            ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
    



        },

        hideList:function(){
            document.querySelector(UISelectors.itemList).style.display='none';
        },
        showTotalCalories:function(totalCalories){
        document.querySelector(UISelectors.totalCalories).textContent=totalCalories;
        },

        clearEditState:function(){
          UICtrl.clearInput();  
          document.querySelector(UISelectors.updateBtn).style.display='none';
          document.querySelector(UISelectors.deleteBtn).style.display='none';
          document.querySelector(UISelectors.backBtn).style.display='none';
          document.querySelector(UISelectors.addBtn).style.display='inline';

        },
         
        showEditState:function(){
 
            document.querySelector(UISelectors.updateBtn).style.display='inline';
            document.querySelector(UISelectors.deleteBtn).style.display='inline';
            document.querySelector(UISelectors.backBtn).style.display='inline';
            document.querySelector(UISelectors.addBtn).style.display='none';
  
          },
  

        getSelectors:function(){
            return UISelectors;
        }

    }

})();

//App controller
const App=(function(ItemCtrl,UICtrl){

    //load event listeners

    const loadEventListeners=function(){
        //Get UI Selector
     const UISelectors=UICtrl.getSelectors();
        
       //Add Item Event
          document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
         
        
          //Edit icon click event
          document.querySelector(UISelectors.itemList).addEventListener('click',
          itemUpdateSubmit);

    }
    //add item submiit
    const itemAddSubmit=function(e){
        //et form input form Ui controllwer

        const input = UICtrl.getItemInput();

        //check for name and calorice input
        if(input.name!=='' && input.calories!==''){
            //add item
          const newItem=ItemCtrl.addItem(input.name,input.calories);  
             //add item to Ui list

             UICtrl.addListItem(newItem);
             //et total calories to UI
             const totalCalories=ItemCtrl.getTotalCalories();
            // Add total calories to UI

             UICtrl.showTotalCalories(totalCalories);






             //clear fields
             UICtrl.clearInput();
        }

        e.preventDefault();
    }

    //Update item submit

    const itemUpdateSubmit=function(e){
         
        if(e.target.classList.contains('edit-item')){

            //get list item id(item-0,item-1)
            const ListId=e.target.parentNode.parentNode.id;
            //break into an arry
            const listIdArr=ListId.split('-');
            
            //get the actual id

            const id=parseInt(listIdArr[1]);

           //Get item
         const itemToEdit=ItemCtrl.getItemById(id);  

         //set current item

         ItemCtrl.setCurrentItem(itemToEdit);


         //add item to from

         ItemCtrl.addItemToForm();






        }
        
        e.preventDefault();
    }


    return {
        init: function(){
            //clear edit state/set inital set
            UICtrl.clearEditState();
            
            const items=ItemCtrl.getItems();
             //check if any items

             if(items.length===0){
                UICtrl.hideList();
             }else{
               //popuate list with items
                   UICtrl.populateItemList(items);
             }

               //et total calories to UI
               const totalCalories=ItemCtrl.getTotalCalories();
               // Add total calories to UI
   
                UICtrl.showTotalCalories(totalCalories);
   
   

            //load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl,UICtrl);

//Initialize App
App.init();